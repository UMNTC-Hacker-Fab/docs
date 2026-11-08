# Local preview server for the docs. No installs needed.
#   powershell -ExecutionPolicy Bypass -File serve.ps1            # http://localhost:8000
#   powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 3000
param([int]$Port = 8000)

$root = $PSScriptRoot
$types = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"; ".js" = "text/javascript; charset=utf-8"
  ".md" = "text/markdown; charset=utf-8"; ".json" = "application/json"; ".svg" = "image/svg+xml"
  ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".gif" = "image/gif"; ".webp" = "image/webp"
  ".ico" = "image/x-icon"; ".pdf" = "application/pdf"; ".mp4" = "video/mp4"; ".woff2" = "font/woff2"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Docs running at http://localhost:$Port  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart("/"))
      if ($rel -eq "") { $rel = "index.html" }
      $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
      if (-not $path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $path -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes("Not found")
      } else {
        $ext = [IO.Path]::GetExtension($path).ToLower()
        $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
        $res.Headers.Add("Cache-Control", "no-cache")
        $bytes = [IO.File]::ReadAllBytes($path)
      }
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host ("{0} {1}" -f $res.StatusCode, $rel)
    } catch {
      $res.StatusCode = 500
    } finally {
      $res.OutputStream.Close()
    }
  }
} finally {
  $listener.Stop()
}
