const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Xcode snippet to modify the Podfile to allow non-modular headers in iOS builds
const withAllowNonModularHeaders = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.projectRoot, 'ios', 'Podfile');
      if (fs.existsSync(podfilePath)) {
        let content = await fs.promises.readFile(podfilePath, 'utf8');
        const searchStr = "react_native_post_install(installer)";
        const replaceStr = "react_native_post_install(installer)\n    installer.pods_project.targets.each do |target|\n      target.build_configurations.each do |config|\n        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'\n      end\n    end";
        
        if (content.includes(searchStr) && !content.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
          content = content.replace(searchStr, replaceStr);
          await fs.promises.writeFile(podfilePath, content, 'utf8');
        }
      }
      return cfg;
    },
  ]);
};

export default {
  expo: {
    name: "karvio",
    slug: "karvio",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/karvio.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/karvio-splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: "com.anonymous.karvioapp",
      buildNumber: "1.0.0",
      supportsTablet: false,
      itsAppUsesNonExemptEncryption: false,
      googleServicesFile: process.env.IOS_GOOGLE_SERVICES_FILE || "./GoogleService-Info.plist"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/karvio.png",
        backgroundColor: "#202e5a"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.karvioapp",
      googleServicesFile: process.env.ANDROID_GOOGLE_SERVICES_FILE || "./google-services.json"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-font",
      "@react-native-community/datetimepicker",
      [
        "@react-native-google-signin/google-signin"
      ],
      "@react-native-firebase/app"
    ],
    extra: {
      eas: {
        projectId: "9d4129ec-0ba9-4e61-b0a7-78ee82561b0f"
      }
    },
    owner: "andreilupu92"
  }
};