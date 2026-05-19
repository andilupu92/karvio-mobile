import { useEffect, useState, useCallback } from "react";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "./homeHeader";
import HomeMenu from "./homeMenu";
import { carApi } from "@/src/api/services/carService";
import { documentApi } from "@/src/api/services/docService";
import { Text } from "@/components/ui/text";
import { CarFront, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { Button } from "@/components/ui/button";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HomeQuickActions from "./homeQuickActions";
import HomeGarage from "./homeGarage";
import HomeAddBottomSheet from "./homeAddSheet";
import { useFocusEffect } from "@react-navigation/native";
import HomeFuelConsumption from "./homeFuelConsumption";
import HomeExpenses from "./homeExpenses";
import HomeHealth from "./homeHealth";
import HomeDocuments from "./homeDocuments";
import AddFuel from "../cars/addFuel";
import { useTheme } from "@/src/context/themeContext";

type TabName = "Home" | "Documents" | "Expenses" | "Settings";

type Car = {
  id: number;
  name: string;
  energyType: string;
  kilometers: number;
  year: number;
  consumption: number;
  healthScore: number;
};

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string,
  documentTypeIconName: string,
  expiryDate: Date,
  daysRemaining: number;
};

type Expense = {
  id: number,
  expenseTypeId: number,
  expenseTypeName: string,
  expenseTypeIconName: string,
  date: Date,
  amount: number
};

type ExpenseHistory = {
  monthName: string;
  totalAmount: number;
  expenseResponseList: Expense[];
}

export default function HomeScreen() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [car, setCar] = useState({ id: 0, km: 0, name: "", healthScore: 0, consumption: 0 });
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showAddFuel, setShowAddFuel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseHistory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  useFocusEffect (
    useCallback(() => {
      const fetchCars = async () => {
        try {
          setLoading(true);
          //const responseData = await carApi.cars();
          const responseData = [
            {"id": 3, "name": "Audi A5", "energyType": "Benzină", "kilometers": 290800, "year": 2011, "consumption": 7.35, "healthScore": 75},
            {"id": 17, "name": "Dacia 1300", "energyType": "Benzină", "kilometers": 324500, "year": 2001,"consumption": 6.00,"healthScore": 100}
          ]
          setCars(responseData);
          setCar({
            id: responseData[0]?.id || 0,
            km: responseData[0]?.kilometers || 0,
            name: responseData[0]?.name || "Nici o mașină",
            healthScore: responseData[0]?.healthScore,
            consumption: responseData[0]?.consumption
          });
          await fetchDocuments(responseData[0]?.id);
          await fetchExpenses(responseData[0]?.id);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
        fetchCars();
    }, [])
  );

  const fetchExpenses = async (carId: number) => {
    try {
      setExpensesLoading(true);
      //const responseData = await documentApi.expenses(carId);
      const responseData = [{"monthName":"aprilie","totalAmount":1645,"expenseResponseList":[{"id":4,"expenseTypeId":8,"expenseTypeName":"Trusă medicală","expenseTypeIconName":"cross","date":new Date("2026-04-27"),"amount":230},{"id":5,"expenseTypeId":11,"expenseTypeName":"Spălătorie","expenseTypeIconName":"droplets","date":new Date("2026-04-27T00:00:00"),"amount":35},{"id":6,"expenseTypeId":1,"expenseTypeName":"Rovinietă","expenseTypeIconName":"road","date":new Date("2026-04-28T00:00:00"),"amount":260},{"id":7,"expenseTypeId":6,"expenseTypeName":"Impozit auto","expenseTypeIconName":"receipt","date":new Date("2026-04-24T00:00:00"),"amount":340},{"id":8,"expenseTypeId":14,"expenseTypeName":"Amenzi","expenseTypeIconName":"triangle-alert","date":new Date("2026-04-27T00:00:00"),"amount":330},{"id":10,"expenseTypeId":1,"expenseTypeName":"Rovinietă","expenseTypeIconName":"road","date":new Date("2026-04-29T00:00:00"),"amount":200},{"id":1,"expenseTypeId":2,"expenseTypeName":"ITP","expenseTypeIconName":"car","date":new Date("2026-04-24T00:00:00"),"amount":250}]},{"monthName":"mai","totalAmount":5590,"expenseResponseList":[{"id":11,"expenseTypeId":11,"expenseTypeName":"Spălătorie","expenseTypeIconName":"droplets","date":new Date("2026-05-01T00:00:00"),"amount":25},{"id":3,"expenseTypeId":6,"expenseTypeName":"Impozit auto","expenseTypeIconName":"receipt","date":new Date("2026-05-08T00:00:00"),"amount":350},{"id":17,"expenseTypeId":7,"expenseTypeName":"Extinctor","expenseTypeIconName":"FireExtinguisher","date":new Date("2026-05-03T00:00:00"),"amount":95},{"id":18,"expenseTypeId":10,"expenseTypeName":"Service&Piese","expenseTypeIconName":"wrench","date":new Date("2026-05-04T00:00:00"),"amount":350},{"id":19,"expenseTypeId":6,"expenseTypeName":"Impozit auto","expenseTypeIconName":"receipt","date":new Date("2026-05-08T00:00:00"),"amount":350},{"id":20,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-05T00:00:00"),"amount":450},{"id":23,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-06T00:00:00"),"amount":450},{"id":24,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-06T00:00:00"),"amount":520},{"id":25,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-05T00:00:00"),"amount":520},{"id":26,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-06T00:00:00"),"amount":490},{"id":27,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-06T00:00:00"),"amount":540},{"id":28,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-07T00:00:00"),"amount":450},{"id":29,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-07T00:00:00"),"amount":430},{"id":30,"expenseTypeId":8,"expenseTypeName":"Trusă medicală","expenseTypeIconName":"cross","date":new Date("2026-05-07T00:00:00"),"amount":340},{"id":32,"expenseTypeId":4,"expenseTypeName":"Revizie","expenseTypeIconName":"wrench","date":new Date("2026-05-07T00:00:00"),"amount":230}]}]
      setExpenses(responseData);
    } catch (error) {
      console.error(error);
    } finally {
      setExpensesLoading(false);
    }
  };

  const fetchDocuments = async (carId: number) => {
    try {
      setDocumentsLoading(true);
      //const responseData = await documentApi.documents(carId);
      const responseData = [{"id":1,"documentTypeId":2,"documentTypeName":"ITP","documentTypeIconName":"car","expiryDate":new Date("2026-04-30"),"daysRemaining":-8,"carName":null,"carId":3},{"id":5,"documentTypeId":1,"documentTypeName":"Rovinietă","documentTypeIconName":"road","expiryDate":new Date("2026-05-08"),"daysRemaining":0,"carName":null,"carId":3}]
      setDocuments(responseData);
    } catch (error) {
      console.error(error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleCarChange = (id: number, km: number, name: string, healthScore: number, consumption: number) => {
    setCar({ id, km, name, healthScore, consumption });
    fetchDocuments(id);
    fetchExpenses(id);
  };

  useEffect(() => {
    if (activeTab === "Expenses") {
        navigation.navigate("ExpensesMenu", { car, cars });
    } else if (activeTab === "Documents") {
        navigation.navigate("DocumentsMenu", { car, cars });
    } else if (activeTab === "Settings") {
      navigation.navigate("Settings", { car, cars });
    }
  }, [activeTab]);

  return (

    <SafeAreaView className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
      <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />
      
        <Box className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-2 py-1`}>

            <HomeHeader
              carName={car.name}
              carKm={car.km}
              healthScore={car.healthScore}
              profileImage={undefined}
              onProfilePress={() => navigation.navigate('Profile')}
              lengthCar={cars.length}
            />

          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}
            enableOnAndroid
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <ActivityIndicator size="small" style={{ marginTop: 16 }} />
            ) : cars.length > 0 ? (
                  <View key={cars.length} className="flex-1 w-full">
                    <HomeQuickActions car={car} cars={cars} documents={documents} />
                    <HomeGarage cars={cars} onCarSelect={handleCarChange} />
                    <HomeFuelConsumption consumption={car.consumption}
                      onAddFuel={() => setShowAddFuel(true)}
                    />
                    <View className="flex-row px-4 gap-3 mb-3">
                      <HomeExpenses
                        expensesHistory={expenses[expenses.length - 1]}
                        period={new Date().toLocaleDateString("ro-RO", { month: "long" }).toUpperCase()}
                        onExpensesPress={() => navigation.navigate('ExpensesDetail', { car, cars, expenses })}
                      />
                      <HomeHealth
                        healthScore={car.healthScore}
                      />
                    </View>
                    <HomeDocuments
                      documents={documents.slice(0,3)}
                      onDocumentPress={(document) => navigation.navigate('DocumentDetail', { car, document, cars })}
                    />
                  </View>
            ) : (
              <View className="px-7 flex-1 items-center justify-center gap-10" style={{ paddingBottom: 180 }}>

                <View className="w-32 h-32 rounded-full bg-secondary-500 items-center justify-center">
                  <CarFront size={60} color="#ffffff" strokeWidth={1.6} />
                </View>

                <Text className="text-center font-inter-medium text-typography-50 leading-6">
                  Nu există mașini în garaj. Adaugă una pentru a începe să urmărești cheltuielile și documentele!
                </Text>

                <Button
                  onPress={() => navigation.navigate('AddCar')}
                  className="flex-row items-center justify-center h-16 bg-secondary-500 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]"
                >
                  <Plus size={18} color="#ffffff" strokeWidth={2.5} />
                  <Text className="text-primary-0 font-inter-semibold text-base">
                    Adaugă o mașină
                  </Text>
                </Button>

              </View>
            )}
          </KeyboardAwareScrollView>
        </Box>

      <HomeMenu
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
        onAddPress={() => setShowAddSheet(prev => !prev)}
      />

      <HomeAddBottomSheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAddCar={() => navigation.navigate('AddCar')}
        onAddDocument={() => navigation.navigate('AddDocument', { car, cars } )}
        onAddExpense={() => navigation.navigate('AddExpense', { cars } )}
      />

      <AddFuel
        visible={showAddFuel}
        carId={car.id}
        onClose={() => setShowAddFuel(false)}
      />

    </SafeAreaView>
  );
}