// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:js' as js;
import 'dart:convert';
import '../data/projects_data.dart';

/// Handles fetching projects from Apps Script and caching in localStorage.
class ProjectsService {
  static const String _cacheKey = 'cached_projects_v2';
  static const String _cacheTsKey = 'cached_projects_ts_v2';
  // 24-hour TTL in milliseconds
  static const int _ttlMs = 24 * 60 * 60 * 1000;

  static bool _scriptInjected = false;
  static void _injectFetchScript() {
    if (_scriptInjected) return;
    _scriptInjected = true;
    final doc = html.document;
    if (doc.getElementById('projects-fetch-helper') == null) {
      final script = html.ScriptElement()
        ..id = 'projects-fetch-helper'
        ..innerHtml = r'''
          window.fetchProjectsFromAppsScript = function(url, successCallback, errorCallback) {
            fetch(url)
              .then(function(response) { return response.json(); })
              .then(function(data) { if (successCallback) successCallback(JSON.stringify(data)); })
              .catch(function(e) { if (errorCallback) errorCallback(e.toString()); });
          };
        ''';
      doc.head?.append(script);
    }
  }

  /// Returns cached/fallback projects immediately, then fetches fresh if cache is stale.
  /// Calls [onProjects] with the initial batch, then again when network responds.
  static void loadProjects({
    required void Function(List<ProjectData> projects, {required bool fromCache}) onProjects,
    void Function(String error)? onError,
  }) {
    _injectFetchScript();

    // 1. Serve from localStorage cache or hardcoded fallback immediately
    final cached = _readCache();
    onProjects(cached ?? allProjects, fromCache: true);

    // 2. Fire network fetch only if cache is stale
    if (!isCacheFresh) {
      _fetchFromNetwork(
        onSuccess: (projects) {
          _writeCache(projects);
          onProjects(projects, fromCache: false);
        },
        onError: onError,
      );
    }
  }

  /// Public getter — true when localStorage cache exists and is < 24h old.
  static bool get isCacheFresh => _isCacheFresh();

  static void _fetchFromNetwork({
    required void Function(List<ProjectData>) onSuccess,
    void Function(String)? onError,
  }) {
    js.context.callMethod('fetchProjectsFromAppsScript', [
      projectsApiUrl,
      (jsonString) {
        try {
          final decoded = json.decode(jsonString as String);
          List<dynamic> rawList;
          if (decoded is List) {
            rawList = decoded;
          } else if (decoded is Map && decoded['data'] is List) {
            rawList = decoded['data'] as List;
          } else {
            onError?.call('Unexpected Apps Script response format');
            return;
          }
          final projects = rawList
              .whereType<Map<String, dynamic>>()
              .map((j) => ProjectData.fromJson(j))
              .where((p) => p.id.isNotEmpty && p.title.isNotEmpty)
              .toList();
          
          if (projects.isEmpty) {
            // Fallback to local hardcoded list if sheet returns no valid projects
            onSuccess(allProjects);
          } else {
            onSuccess(projects);
          }
        } catch (e) {
          onError?.call('Parse error: $e');
        }
      },
      (error) => onError?.call('Fetch error: $error'),
    ]);
  }

  static List<ProjectData>? _readCache() {
    try {
      final raw = html.window.localStorage[_cacheKey];
      if (raw == null || raw.isEmpty) return null;
      final List<dynamic> list = json.decode(raw);
      return list.whereType<Map<String, dynamic>>()
          .map((j) => ProjectData.fromJson(j))
          .toList();
    } catch (_) {
      return null;
    }
  }

  static void _writeCache(List<ProjectData> projects) {
    try {
      final list = projects.map((p) => {
        'id': p.id,
        'title': p.title,
        'subtitle': p.subtitle,
        'status': p.status,
        'tagline': p.tagline,
        'description': p.description,
        'features': p.features.join(','),
        'tech': p.tech.join(','),
        'link_texts': p.links.map((l) => l.text).join('|'),
        'link_urls': p.links.map((l) => l.url).join('|'),
        'categories': p.categories.join(','),
      }).toList();
      html.window.localStorage[_cacheKey] = json.encode(list);
      html.window.localStorage[_cacheTsKey] =
          DateTime.now().millisecondsSinceEpoch.toString();
    } catch (_) {}
  }

  static bool _isCacheFresh() {
    try {
      final tsStr = html.window.localStorage[_cacheTsKey];
      if (tsStr == null) return false;
      final age = DateTime.now().millisecondsSinceEpoch - int.parse(tsStr);
      return age < _ttlMs;
    } catch (_) {
      return false;
    }
  }
}
