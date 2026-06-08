import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Text } from '@/components/ui/text';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from '@/components/ui/box';
import { documentApi } from '@/src/api/services/docService';
import HomeMenu from '../home/homeMenu';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import HomeAddBottomSheet from '../home/homeAddSheet';
import DocumentCard from './documentCard';
import { useTheme } from '@/src/context/themeContext';
import { Icons } from '@/src/utils/icons';
import { Button, ButtonText } from '@/components/ui/button';
import { Plus } from 'lucide-react-native';

type TabName = 'Home' | 'Documents' | 'Expenses' | 'Settings';

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string;
  documentTypeIconName: string;
  expiryDate: Date;
  daysRemaining: number;
  carName: string;
  carId: number;
};

type DocumentsSummary = {
  urgentCount: number;
  soonCount: number;
  validCount: number;
  documents: Document[];
};

interface StatCardProps {
  count: number | undefined;
  label: string;
  countColor: string;
  isDark: boolean;
}

export default function DocumentsMenu() {
  const [activeTab, setActiveTab] = useState<TabName>('Documents');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DocumentsMenu'>>();
  const { car, cars } = route.params;
  const [loading, setLoading] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [documentsSummary, setDocumentsSummary] = useState<DocumentsSummary>();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const responseData = await documentApi.documentsHistory();
        setDocumentsSummary(responseData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const actionRequired = documentsSummary?.documents.filter((doc) => doc.daysRemaining <= 10);
  const valid = documentsSummary?.documents.filter((doc) => doc.daysRemaining > 10);

  useEffect(() => {
    if (activeTab === 'Home') {
      navigation.navigate('Home');
    } else if (activeTab === 'Expenses') {
      navigation.navigate('ExpensesMenu', { car, cars });
    } else if (activeTab === 'Settings') {
      navigation.navigate('Settings', { car, cars });
    }
  }, [activeTab]);

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}
    >
      <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />
      {/* ── Header ── */}
      <View className="flex-row items-center px-6 pt-4 pb-4">
        <Text
          className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-2xl mb-2`}
        >
          Documente
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
          <View className="flex-1 mt-3">
            {loading ? (
              <ActivityIndicator size="small" color="#14b8a6" style={{ marginTop: 40 }} />
            ) : (documentsSummary?.documents?.length ?? 0) > 0 ? (
              <Box>
                <View className="flex-row mb-2">
                  <StatCard
                    count={documentsSummary?.urgentCount}
                    label="Urgente"
                    countColor="text-error-50"
                    isDark={isDark}
                  />
                  <StatCard
                    count={documentsSummary?.soonCount}
                    label="În curând"
                    countColor="text-warning-50"
                    isDark={isDark}
                  />
                  <StatCard
                    count={documentsSummary?.validCount}
                    label="Valabile"
                    countColor="text-success-50"
                    isDark={isDark}
                  />
                </View>

                {(actionRequired?.length ?? 0) > 0 && (
                  <>
                    <Text
                      className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base mx-4 mt-6 mb-2`}
                    >
                      Acțiuni Necesare
                    </Text>
                    {actionRequired?.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onPress={() =>
                          navigation.navigate('DocumentDetail', {
                            car: { ...car, name: doc.carName, id: doc.carId },
                            document: doc,
                            cars,
                          })
                        }
                      />
                    ))}
                  </>
                )}

                {(valid?.length ?? 0) > 0 && (
                  <>
                    <Text
                      className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base mx-4 mt-6 mb-2`}
                    >
                      Valabile
                    </Text>
                    {valid?.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onPress={() =>
                          navigation.navigate('DocumentDetail', {
                            car: { ...car, name: doc.carName, id: doc.carId },
                            document: doc,
                            cars,
                          })
                        }
                      />
                    ))}
                  </>
                )}
              </Box>
            ) : (
              <View
                className="px-7 flex-1 items-center justify-center gap-10"
                style={{ paddingBottom: 200 }}
              >
                <View className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} w-32 h-32 rounded-full items-center justify-center`}>
                                <Icons.FileText
                                  className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                  size={60}
                                  strokeWidth={1.6}
                                />
                              </View>
                              <View className="items-center justify-center mt-10 px-8">
                  <Text
                    className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base text-center`}
                  >
                    Niciun document găsit
                  </Text>
                  <Text
                    className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm text-center mt-1`}
                  >
                    Adaugă documente pentru mașinile tale pentru a le urmări ușor.
                  </Text> 
                </View>

                <Button
                  onPress={() => navigation.navigate('AddDocument', { car, cars })}
                  className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]`}
                >
                  <Plus size={18} color="#ffffff" strokeWidth={2.5} />
                  <ButtonText
                    className={`${isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}
                  >
                    Adaugă un document
                  </ButtonText>
                </Button>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </Box>

      <HomeMenu
        cars={cars}
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
        onAddPress={() => setShowAddSheet((prev) => !prev)}
      />

      <HomeAddBottomSheet
        cars={cars}
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAddCar={() => navigation.navigate('AddCar')}
        onAddDocument={() => navigation.navigate('AddDocument', { car, cars })}
        onAddExpense={() => navigation.navigate('AddExpense', { cars })}
      />
    </SafeAreaView>
  );
}

function StatCard({ count, label, countColor, isDark }: StatCardProps) {
  return (
    <View
      className={`flex-1 rounded-xl items-center justify-center py-4 mx-1.5 border ${isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100'}`}
    >
      <Text className={`font-inter-bold text-2xl ${countColor}`}>{count}</Text>
      <Text
        className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-medium text-xs mt-0.5 tracking-wide uppercase`}
      >
        {label}
      </Text>
    </View>
  );
}
