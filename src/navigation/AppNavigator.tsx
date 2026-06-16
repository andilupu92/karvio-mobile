import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../page/auth/login';
import HomeScreen from '../page/home/homeScreen';
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
import PersonalDocumentDetail from '../page/profile/personalDocumentDetail';
import AddPersonalDocument from '../page/profile/addPersonalDocument';
import PersonalDocuments from '../page/profile/personalDocuments';
import Notifications from '../page/profile/notifications';
import BugReportScreen from '../page/profile/bugReport';
import FeedbackScreen from '../page/profile/feedback';
import ContactUsScreen from '../page/profile/contactUs';
import AboutAppScreen from '../page/profile/aboutApp';
import VerifyOTPScreen from '../page/auth/verifyOTP';
import ResetPasswordScreen from '../page/auth/resetPassword';
import PrivacyPolicyScreen from '../page/settings/privacyPolicy';
import TermsAndConditionsScreen from '../page/settings/termsAndConditions';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

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
};

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string;
  documentTypeIconName: string;
  expiryDate: Date;
  daysRemaining: number;
};

type Expense = {
  id: number;
  expenseTypeId: number;
  expenseTypeName: string;
  expenseTypeIconName: string;
  date: Date;
  amount: number;
};

type ExpenseHistory = {
  monthName: string;
  totalAmount: number;
  expenseResponseList: Expense[];
};

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  AddCar: undefined;
  AddDocument: { car: CarItem; cars: Car[]; document?: Document };
  AddExpense: { cars: Car[] };
  Documents: { car: CarItem; cars: Car[]; documents: Document[] };
  DocumentDetail: { car: CarItem; document: Document; cars: Car[] };
  Cars: undefined;
  CarDetail: { car: CarWithExpenses };
  ExpensesDetail: { car: CarItem; cars: Car[]; expenses: ExpenseHistory[] };
  ExpensesMenu: { car: CarItem; cars: Car[] };
  DocumentsMenu: { car: CarItem; cars: Car[] };
  Settings: { car: CarItem; cars: Car[] };
  Profile: undefined;
  PersonalDocuments: undefined;
  PersonalDocumentDetail: { document: Document };
  AddPersonalDocument: { document?: Document };
  Notifications: undefined;
  BugReportScreen: undefined;
  FeedbackScreen: undefined;
  ContactUsScreen: undefined;
  AboutAppScreen: undefined;
  ForgotPassword: undefined;
  VerifyOTP: { email: string };
  ResetPassword: { email: string; otpCode: string };
  PrivacyPolicyScreen: undefined;
  TermsAndConditionsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {accessToken ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddCar" component={AddCar} />
          <Stack.Screen name="AddDocument" component={AddDocument} />
          <Stack.Screen name="AddExpense" component={AddExpense} />
          <Stack.Screen name="Documents" component={Documents} />
          <Stack.Screen name="DocumentDetail" component={DocumentDetail} />
          <Stack.Screen name="Cars" component={Cars} />
          <Stack.Screen name="CarDetail" component={CarDetail} />
          <Stack.Screen name="ExpensesDetail" component={ExpensesDetail} />
          <Stack.Screen name="ExpensesMenu" component={ExpensesMenu} />
          <Stack.Screen name="DocumentsMenu" component={DocumentsMenu} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="PersonalDocuments" component={PersonalDocuments} />
          <Stack.Screen name="PersonalDocumentDetail" component={PersonalDocumentDetail} />
          <Stack.Screen name="AddPersonalDocument" component={AddPersonalDocument} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="BugReportScreen" component={BugReportScreen} />
          <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
          <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
          <Stack.Screen name="AboutAppScreen" component={AboutAppScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
      
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
    </Stack.Navigator>
  );
}