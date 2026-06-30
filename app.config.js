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
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static",
            forceStaticLinking: ["RNFBApp", "RNFBMessaging"],
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