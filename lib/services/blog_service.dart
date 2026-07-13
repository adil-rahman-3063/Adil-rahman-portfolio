// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:js' as js;
import 'dart:convert';
import '../data/blog_data.dart';
import '../data/projects_data.dart' show reviewsApiUrl;

/// Handles fetching blog posts from Apps Script and caching in localStorage.
class BlogService {
  static const String _cacheKey = 'cached_blogs_v2';
  static const String _cacheTsKey = 'cached_blogs_ts_v2';
  // 24-hour TTL in milliseconds
  static const int _ttlMs = 24 * 60 * 60 * 1000;

  static bool _scriptInjected = false;
  static void _injectFetchScript() {
    if (_scriptInjected) return;
    _scriptInjected = true;
    final doc = html.document;
    if (doc.getElementById('blogs-fetch-helper') == null) {
      final script = html.ScriptElement()
        ..id = 'blogs-fetch-helper'
        ..innerHtml = r'''
          window.fetchBlogsFromAppsScript = function(url, successCallback, errorCallback) {
            fetch(url)
              .then(function(response) { return response.json(); })
              .then(function(data) { if (successCallback) successCallback(JSON.stringify(data)); })
              .catch(function(e) { if (errorCallback) errorCallback(e.toString()); });
          };
        ''';
      doc.head?.append(script);
    }
  }

  /// Returns cached/fallback blogs immediately, then fetches fresh if cache is stale.
  static void loadBlogs({
    required void Function(List<BlogPost> blogs, {required bool fromCache}) onBlogs,
    void Function(String error)? onError,
  }) {
    _injectFetchScript();

    final cached = _readCache();
    onBlogs(cached ?? allBlogs, fromCache: true);

    if (!isCacheFresh) {
      _fetchFromNetwork(
        onSuccess: (blogs) {
          _writeCache(blogs);
          onBlogs(blogs, fromCache: false);
        },
        onError: onError,
      );
    }
  }

  static bool get isCacheFresh => false;

  static void _fetchFromNetwork({
    required void Function(List<BlogPost>) onSuccess,
    void Function(String)? onError,
  }) {
    final blogsUrl = '$reviewsApiUrl?action=getBlogs';
    js.context.callMethod('fetchBlogsFromAppsScript', [
      blogsUrl,
      (jsonString) {
        try {
          final decoded = json.decode(jsonString as String);
          List<dynamic> rawList;
          if (decoded is List) {
            rawList = decoded;
          } else if (decoded is Map && decoded['data'] is List) {
            rawList = decoded['data'] as List;
          } else {
            onError?.call('Unexpected response format');
            return;
          }
          final blogs = rawList
              .whereType<Map<String, dynamic>>()
              .map((j) => BlogPost.fromJson(j))
              .where((b) => b.id.isNotEmpty && b.title.isNotEmpty)
              .toList();
          
          if (blogs.isEmpty) {
            onSuccess(allBlogs);
          } else {
            onSuccess(blogs);
          }
        } catch (e) {
          onError?.call('Parse error: $e');
        }
      },
      (error) => onError?.call('Fetch error: $error'),
    ]);
  }

  static List<BlogPost>? _readCache() {
    try {
      final raw = html.window.localStorage[_cacheKey];
      if (raw == null || raw.isEmpty) return null;
      final List<dynamic> list = json.decode(raw);
      return list.whereType<Map<String, dynamic>>()
          .map((j) => BlogPost.fromJson(j))
          .toList();
    } catch (_) {
      return null;
    }
  }

  static void _writeCache(List<BlogPost> blogs) {
    try {
      final list = blogs.map((b) => {
        'id': b.id,
        'title': b.title,
        'date': b.date,
        'readTime': b.readTime,
        'excerpt': b.excerpt,
        'content': b.content,
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
