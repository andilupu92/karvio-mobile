import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "../page/auth/login";
import HomeScreen from "../page/home/homeScreen";
import ForgotPasswordScreen from '../page/auth/forgotPassword';
import SignUpScreen from '../page/auth/signUp';
import AddCar from '../page/cars/addCar';
import AddDocument from '../page/documents/addDocument';
import AddExpense from '../page/expenses/addExpense';
import Documents from '../page/documents/documents';
import DocumentDetail from '../page/documents/documentDetail';
import Cars from '../page/cars/cars';
import CarDetail from '../page/cars/carDetail';
import ExpensesDetail from '../page/expenses/expensesDetail';
import ExpensesMenu from '../page/expenses/expensesMenu';
import DocumentsMenu from '../page/documents/documentsMenu';
import Settings from '../page/settings/settings';
import Profile from '../page/profile/profile';

type Car = {
  id: number;
  name: string;
  energyType: string;
  kilometers: number;
  year: number;
  consumption: number;
  healthScore: number;
};

type CarItem = {
  id: number;
  km: number;
  name: string;
  consumption: number;
  healthScore: number;
};

type CarWithExpenses = {
    carId: number;
    name: string;
    consumption: number;
    healthScore: number | null;
    amount: number;
}

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string;
  documentTypeIconName: string;
  expiryDate: Date;
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

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  AddCar: undefined;
  AddDocument: { car: CarItem, cars: Car[], document?: Document };
  AddExpense: { cars: Car[] };
  Documents: { car: CarItem, cars: Car[], documents: Document[] };
  DocumentDetail: { car: CarItem, document: Document, cars: Car[] }
  Cars: undefined;
  CarDetail: {car: CarWithExpenses};
  ExpensesDetail: {car: CarItem, cars: Car[], expenses: ExpenseHistory[] };
  ExpensesMenu: { car: CarItem, cars: Car[] };
  DocumentsMenu: { car: CarItem, cars: Car[] };
  Settings: { car: CarItem, cars: Car[] };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
//const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

export default function AppNavigator() {
    return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        {/*{isAuthenticated ? (
          <>*/}
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          {/*</>
          ) : (
          <>*/}
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddCar" component={AddCar} options={{ headerShown: false }}/>
            <Stack.Screen name="AddDocument" component={AddDocument} options={{ headerShown: false }}/>
            <Stack.Screen name="AddExpense" component={AddExpense} options={{ headerShown: false }}/>
            <Stack.Screen name="Documents" component={Documents} options={{ headerShown: false }}/>
            <Stack.Screen name="DocumentDetail" component={DocumentDetail} options={{ headerShown: false }}/>
            <Stack.Screen name="Cars" component={Cars} options={{ headerShown: false }}/>
            <Stack.Screen name="CarDetail" component={CarDetail} options={{ headerShown: false }}/>
            <Stack.Screen name="ExpensesDetail" component={ExpensesDetail} options={{ headerShown: false }}/>
            <Stack.Screen name="ExpensesMenu" component={ExpensesMenu} options={{ headerShown: false }}/>
            <Stack.Screen name="DocumentsMenu" component={DocumentsMenu} options={{ headerShown: false }}/>
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
          {/*</>
        )}*/}
        </Stack.Navigator>
    );
}