import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/src/context/themeContext';
import * as Icons from 'lucide-react-native';
import DocumentCard from '../documents/documentCard';
import { documentApi } from '@/src/api/services/docService';
import { useEffect, useState } from 'react';

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string;
  documentTypeIconName: string;
  expiryDate: Date;
  daysRemaining: number;
};

export default function PersonalDocuments() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
        try {
          setLoading(true);
          const responseData = await documentApi.personalDocuments();
          setDocuments(responseData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    };
    fetchDocuments();
  }, []);

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}
    >
      <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />

      {/* ── Header ── */}
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={`w-10 h-10 ${isDark ? 'bg-background-card-900' : 'bg-background-card-100'} rounded-full items-center justify-center`}
          activeOpacity={0.7}
        >
          <Icons.ChevronLeft
            className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
            size={20}
            strokeWidth={1.6}
          />
        </TouchableOpacity>
        <Text
          className={`${isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-semibold text-center flex-1`}
          style={{ marginRight: 36 }}
        >
          Documentele personale
        </Text>
      </View>
      
      <Box
        className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-2 py-1`}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
            {loading ? (
                <ActivityIndicator size="small" style={{ marginTop: 16 }} />
                ) : documents.length > 0 ? (
                 <>
                    {documents.map((document) => (
                      <DocumentCard
                        key={document.id}
                        document={document}
                        onPress={() => navigation.navigate('PersonalDocumentDetail', { document })}
                      />
                    ))}

                    <View className="px-4 flex-1 items-center justify-center">
                      <Button
                        onPress={() => navigation.navigate('AddPersonalDocument', { })}
                        className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]`}
                      >
                        <Icons.Plus
                          className={`${isDark ? 'text-icons-100' : 'text-icons-900'}`}
                          size={18}
                          strokeWidth={2.5}
                        />
                        <Text
                          className={`${isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-semibold text-base`}
                        >
                          Adaugă un document
                        </Text>
                      </Button>
                    </View>
                  </>  
                ) : (
            <View
              className="px-7 flex-1 items-center justify-center gap-10"
              style={{ paddingBottom: 180 }}
            >
              <View
                className={`w-32 h-32 rounded-full ${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} items-center justify-center`}
              >
                <Icons.FileText
                  className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                  size={60}
                  strokeWidth={1.6}
                />
              </View>

              <Text
                className={`${isDark ? 'text-typography-900' : 'text-typography-100'} text-center font-inter-medium leading-6`}
              >
                Nu există documente pentru utilizator. Adaugă primul document!
              </Text>

              <Button
                onPress={() => navigation.navigate('AddPersonalDocument', { })}
                className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]`}
              >
                <Icons.Plus
                  className={`${isDark ? 'text-icons-100' : 'text-icons-900'}`}
                  size={18}
                  strokeWidth={2.5}
                />
                <Text
                  className={`${isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-semibold text-base`}
                >
                  Adaugă un document
                </Text>
              </Button>
            </View>
            
          )}
          
        </KeyboardAwareScrollView>
      </Box>
    </SafeAreaView>
  );
}
