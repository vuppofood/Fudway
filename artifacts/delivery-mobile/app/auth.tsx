import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BRAND_GREEN = '#06462B';
const LOGO_ASPECT_RATIO = 2172 / 724;
const SIGN_IN_BUTTON_TOP = 0.463;
const AUTH_BUTTON_HEIGHT = 0.067;
const CREATE_ACCOUNT_BUTTON_TOP = 0.592;
const DIVIDER_HEIGHT = 0.029;

export default function AuthenticationScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentHeight = height - insets.top - insets.bottom;
  const logoWidth = Math.min(width * 0.76, 600);
  const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/logo_fudway.png')}
          resizeMode="contain"
          style={[
            styles.logo,
            {
              width: logoWidth,
              height: logoHeight,
              top: contentHeight * 0.292 - logoHeight / 2,
            },
          ]}
          accessibilityLabel="Fudway"
        />

        <View
          style={[
            styles.actions,
            {
              width: width * 0.82,
              left: width * 0.09,
              top: contentHeight * SIGN_IN_BUTTON_TOP,
              height: contentHeight * AUTH_BUTTON_HEIGHT,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('./login')}
            style={({ pressed }) => [
              styles.signInButton,
              { opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.signInLabel}>Entrar</Text>
          </Pressable>
        </View>
        <View
          style={[
            styles.orRow,
            {
              width: width * 0.8,
              left: width * 0.1,
              top:
                contentHeight *
                ((SIGN_IN_BUTTON_TOP + AUTH_BUTTON_HEIGHT + CREATE_ACCOUNT_BUTTON_TOP) /
                  2 -
                  DIVIDER_HEIGHT / 2),
              height: contentHeight * DIVIDER_HEIGHT,
            },
          ]}
        >
          <View style={styles.orLine} />
          <Text style={styles.orLabel}>ou</Text>
          <View style={styles.orLine} />
        </View>
        <View
          style={[
            styles.createAccountAction,
            {
              width: width * 0.82,
              left: width * 0.09,
              top: contentHeight * CREATE_ACCOUNT_BUTTON_TOP,
              height: contentHeight * AUTH_BUTTON_HEIGHT,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('./signup')}
            style={({ pressed }) => [
              styles.createAccountButton,
              { opacity: pressed ? 0.72 : 1 },
            ]}
          >
            <Text style={styles.createAccountLabel}>Criar nova conta</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
  },
  actions: {
    position: 'absolute',
  },
  signInButton: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 20,
  },
  signInLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  orRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  orLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#D6D6D6',
  },
  orLabel: {
    color: '#9B9B9B',
    fontSize: 15,
    fontWeight: '600',
  },
  createAccountButton: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  createAccountAction: {
    position: 'absolute',
  },
  createAccountLabel: {
    color: '#242424',
    fontSize: 17,
    fontWeight: '600',
  },
});
