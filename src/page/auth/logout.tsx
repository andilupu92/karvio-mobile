import { Button, ButtonText } from '@/components/ui/button';
import { authApi } from '../../api/services/authService';
import { useAuthStore } from '../../store/authStore';

export const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await logout();
    }
  };

  return (
    <Button onPress={handleLogout} className="bg-red-500 rounded-xl active:opacity-80" size="lg">
      <ButtonText className="font-medium">Log Out</ButtonText>
    </Button>
  );
};
