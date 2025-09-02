import React, { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";

export default function Toast({
  visible,
  message,
  type = "info", // "success", "error", "warning", "info"
  duration = 3000,
  onHide,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const colors = {
    success: { bg: "#22c55e", text: "#fff" },
    error: { bg: "#ef4444", text: "#fff" },
    warning: { bg: "#f59e0b", text: "#fff" },
    info: { bg: "#3b82f6", text: "#fff" },
  };

  const currentColor = colors[type] || colors.info;

  useEffect(() => {
    if (visible) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide après duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 50,
        left: 16,
        right: 16,
        zIndex: 9999,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={{
          backgroundColor: currentColor.bg,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              flex: 1,
              color: currentColor.text,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {message}
          </Text>
          <TouchableOpacity onPress={hideToast} style={{ marginLeft: 8 }}>
            <Text
              style={{
                color: currentColor.text,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              ×
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}







