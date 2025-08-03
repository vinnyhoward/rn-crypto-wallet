require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../package.json')))

Pod::Spec.new do |s|
  s.name         = 'Didcomm'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "13.0"
  s.source       = { :git => "https://github.com/yourusername/didcomm-sdk.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,mm}"
  s.vendored_libraries = "ios/libdidcomm_sdk.dylib"
  s.preserve_paths = "ios/**/*"
  s.dependency "React-Core"
end