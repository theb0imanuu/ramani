export default {
  expo: {
    name: "Ramani Mobile",
    slug: "ramani-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/ramani_logo.png", // The prompt says assets are in root
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/ramani_splash.png", // The prompt says assets are in root
      resizeMode: "contain",
      backgroundColor: "#0e2944"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/ramani_logo.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png" // The prompt says assets are in root
    }
  }
};
