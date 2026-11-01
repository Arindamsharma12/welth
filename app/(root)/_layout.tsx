import { useUserSync } from "@/hooks/userUserSync";
import { useUserStore } from "@/store/user.store";
import { useAuth } from "@clerk/expo";
import { Redirect, Slot, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootGroupLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const needsOnboarding = useUserStore((state) => state.needsOnboarding);
  const pathname = usePathname();
  const [minLoadDone, setMinLoadDone] = useState(false);

  useUserSync();

  useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-up" />;
  }

  if (!minLoadDone || needsOnboarding === null) {
    return (
      <View className="flex-1 bg-brand-body items-center justify-center">
        <ActivityIndicator size={"large"} color="#1A1D26" />
      </View>
    );
  }

  if (needsOnboarding && pathname !== "/onboarding") {
    return <Redirect href="/(root)/onboarding" />;
  }

  return <Slot />;
}
