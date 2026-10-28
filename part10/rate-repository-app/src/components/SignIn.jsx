import Text from './Text';
import {Pressable,View,TextInput,StyleSheet} from "react-native"
import {useFormik }from "formik"
import * as yup from "yup";
import theme from '../theme';
import useSignIn from "../hooks/useSignIn"
import {useApolloClient } from '@apollo/client/react';
import AuthStorage from "../utils/authStorage"
import { useNavigate } from 'react-router-native'
const styles = StyleSheet.create({
  container: {
    padding: 15,          // 画面の端から少し余白を開ける
    backgroundColor: 'white',
    flex: 1,
  },
  input: {
    borderWidth: 1,       // 枠線の太さ
    borderColor: '#ccc',  // 枠線の色（薄いグレー）
    padding: 12,          // 入力欄の中の余白
    marginBottom: 15,     // 下の要素との隙間
    borderRadius: 4,      // 角を少し丸くする
    fontSize: 16,         // 文字サイズ
    fontFamily: theme.fonts.main,
  },
  button: {
    backgroundColor: '#0366d6', // キレイな青色（GitHubっぽい色）
    padding: 15,                // ボタンの上下左右の余白
    alignItems: 'center',       // 文字を中央に寄せる
    borderRadius: 4,            // 角を丸くする
    marginTop: 5,               // 上の要素との隙間
  },
  buttonText: {
    color: 'white',             // 文字の色を白に
    fontSize: 16,
    fontWeight: 'bold',         // 太字にする
  },
});

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, "password must be greater or equal to 5")
    .required("username is required"),
  password: yup
    .string()
    .min(5, "password must be greater or equal to 5")
    .required("password is required"),
});

export const SignInContainer = ({onSubmit}) => {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit,
  });

return (<View style={styles.container}>
        <TextInput
        style={styles.input} 
        placeholder="username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur("username")}
        testID="usernameField" 
      />
            {formik.touched.username && formik.errors.username && (
        <Text style={{ color: "red" }}>{formik.errors.username}</Text>
      )}
      <TextInput
              style={styles.input} 
        placeholder="password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
         onBlur={formik.handleBlur("password")}
         testID="passwordField" 
      />
                  {formik.touched.password && formik.errors.password && (
        <Text style={{ color: "red" }}>{formik.errors.password}</Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}
      testID="submitButton">
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
    )
  
}



const SignIn = () => {

const [signIn] = useSignIn();
const navigate = useNavigate(); 
const apolloClient = useApolloClient();
const onSubmit = async (values) => {
  console.log("送信しようとしている値:", values); // 👈 ここで何が入っているかチェック！
const { username, password } = values;


const Auth = new AuthStorage(username);

try {
  const data = await signIn({username,password})
  console.log("login success",data)
  const accessToken = data.data.authenticate.accessToken;
  await Auth.setAccessToken(accessToken)
  await apolloClient.resetStore();
  navigate('/');
} catch (e){
  console.log("login error", e)
}
};

// const initialValues = {
//   username: '',
//   password: '',
// };

// const validationSchema = yup.object().shape({
//   username: yup
//     .string()
//     .min(5, "password must be greater or equal to 5")
//     .required("username is required"),
//   password: yup
//     .string()
//     .min(5, "password must be greater or equal to 5")
//     .required("password is required"),
// });

  // const formik = useFormik({
  //   initialValues,
  //   validationSchema,
  //   onSubmit,
  // });


  return (
<SignInContainer onSubmit={onSubmit}/>
  );
};

export default SignIn;