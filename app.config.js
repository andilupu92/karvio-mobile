const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// CONFIG PLUGIN: Acest script adaugă la sfârșitul Podfile-ului setarea Xcode care repară eroarea de Firebase
const withXcodeNonModularHeadersFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.projectRoot, 'ios', 'Podfile');
      if (fs.existsSync(podfilePath)) {
        let content = await fs.promises.readFile(podfilePath, 'utf8');
        
        const fixScript = `
# Fix de securitate pentru Firebase & Google Non-Modular Headers
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
    end
  end
end
`;
        
        if (!content.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
          content += fixScript;
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
    newArchEnabled: false,
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
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "9d4129ec-0ba9-4e61-b0a7-78ee82561b0f"
      }
    },
    owner: "andreilupu92"
  }
};