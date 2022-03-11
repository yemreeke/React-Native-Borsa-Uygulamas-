import React from 'react';
import {Image,View,TouchableOpacity,Text,StyleSheet } from 'react-native';

const HomeScreen = (props) => {
  return <View style={styles.view}>
    
    <Image  //Resimi gösteriyoruz
      style={styles.image} 
      source={require("../../logo.png")
    }/>
    
    <TouchableOpacity  // Diğer ekrana yönelmek için buton oluşturuyoruz.
      style={styles.to}  // Tasarımını burda yapıyoruz.
      onPress={()=>props.navigation.navigate("ListeleScreen")}
      >
      <Text style={styles.text}>Borsaları Listele</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={styles.to} 
      onPress={()=>props.navigation.navigate("ConvertScreen")}
      >
      <Text style={styles.text}>Çevir</Text>
    </TouchableOpacity>    
  </View>
};

const styles = StyleSheet.create({
  image:{ //Resimin Tasarımları 
    marginTop:25, //Yukarıdan boşluk
    margin:15, // yukarı aşağı sağ sol boşluk
    height:250,  //yükseklik
    width:250, //genişlik
  },
  view:{
    alignItems:"center", // ortala
  },
  to:{
    width:300,
    margin:7,
    fontSize:30,
    fontWeight:"bold", //kalın yap
    alignItems: "center", //ortala
    backgroundColor: "orange", //arkaplan renk
    padding: 20,
    borderRadius:15, // köşelerini yuvarlak yap
  },
  text: {
    fontSize: 30, //yazı fontu
    fontWeight:"bold", //yazıyı kalın yap
  },
});

export default HomeScreen;
