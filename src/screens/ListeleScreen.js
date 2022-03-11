import React, { useState } from 'react';
import {Text, View,StyleSheet, TouchableOpacity,Alert} from 'react-native';
import DatePicker from "react-native-neat-date-picker";
import {Table,TableWrapper, Row, Rows, Col, Cols, Cell} from "react-native-table-component";

const ListeleScreen = ()=>{
  const [showDatePicker, setShowDatePicker] = useState(false); // Tarih seçiciyi göstermek ve gizlemek için değişkem
  const [veriTarih, setVeriTarih] = useState(); // çektiğimiz verinin tarihini saklamak için değişken
  const [data, setData] = useState([1]); // çektiğimiz veriyi saklamak için değişken
  const [tarih, setTarih] = useState({   //Seçtiğimiz Tarih bilgilerini saklamak için değişken dizi olarak saklıyoruz
    "gun":"01",
    "ay":"01",
    "yil":"2000",
  });
  const [tarihSecildiMi ,setTarihSecildiMi] = useState(false); // Tarih seçildi mi seçilmedi mi anlamak için değişken
  
  const getBorsa = () => { // Borsadan verileri çekiyoruz.
    var gun = tarih.gun;  // Hangi tarihin
    var ay =  tarih.ay;  // verilerini çekeceksek
    var yil = tarih.yil; // onun bilgilerini elde ediyoruz.
    //var proxyUrl = 'https://corsanywhere.herokuapp.com/', 
    //o bilgilere göre bir url oluşturuyoruz.
    var targetUrl = "https://yemreeke.com/borsa.php?url=https://www.tcmb.gov.tr/kurlar/"+yil+""+ay+"/"+gun+""+ay+""+yil+".xml";
    //targetUrl = "https://yemreeke.com/a.php?url=https://www.tcmb.gov.tr/kurlar/202201/10012022.xml";
    //targetUrl="https://reactnative.dev/movies.json" // örnek json
    console.log(targetUrl); 
    // oluşturulan url yi consola da gösteriyoruz.
    fetch(targetUrl, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }})
      .then((response) =>{
        return response.json();
      }
      )
      .then((json) => {
        if(json==false){
          Alert.alert(
            "Uyarı!",
            "Borsanın Kapalı Olduğu Tarihi Seçtiniz!",
            [
                { text: "Tamam"}
            ],
            { cancelable: false }

            );
          setData([]); // ve veryi kaydediyoruz.
          setVeriTarih(null); // Çektiğimiz verinin tarihini 
        }
        else{
          setVeriTarih(json["@attributes"].Tarih); // Çektiğimiz verinin tarihini 
          setData(json.Currency); // ve veryi kaydediyoruz.
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  const openDatePicker = () => { // Tarih Seçici açınca
    setShowDatePicker(true);
  }
  const onCancel = () => { // Kapatınca iptal edince
    setShowDatePicker(false);
  }
  const onConfirm = ( date ) => { // Tarihi onaylayınca
    setShowDatePicker(false); // kapatıyor 
    const tempGun = date.getDate(); //günü
    const tempAy = date.getMonth()+1; //ayı
    var gun = "";
    var ay = "";
    const yil = date.getFullYear(); //yılı elde ediyoruz.

    // Bu kısımda 1/1/2022 yerine 01/01/2022 gibi olmasını sağlıyoruz.
    // 10 a bölümünden kalan 1 den küçükse  başına 0 ekle
    // değilse ekleme orjinali gibi kullan 
    // 1 2 3 4 5 6 7 8 9 un başına 01 02 .. 09 gibi yapıyor kısaca
    if(tempGun/10<1){
       gun = "0"+tempGun.toString();
    }
    else{
      gun = tempGun;
    }
    if(tempAy/10<1){
      ay = "0"+tempAy.toString();
    }
    else{
      ay =tempAy;
    }
    // tarihi bir dizide string şeklinde saklıyoruz.
    // int olarak saklarsak 01...09 lar 1...9 olarak saklanır. 
    // 2 basamaklı saklamak için stringe çeviriyoruz.
    const tarihh= {"gun":gun.toString(),"ay":ay.toString(),"yil":yil.toString()};
    // Tarih dizisini kaydediyoruz
    setTarih(tarihh);
    setTarihSecildiMi(true); // Tarih seçildimi true olarak belirliyoruz.
    /*
    console.log(tarihate.getMonth()+1);
    console.log(date.getDate());
    console.log(date.getFullYear());
    */
  }
  //    Adet,BorsaIsmi,AlışFiyat,SatışFiyat
  const flexArr = [2.5,12.5,4,4.5]; // Tablonun genişlik oranlarını ayarlıyoruz
  return (
    <View style={styles.view}>
      <TouchableOpacity  // Tarih Seçme Butonu
        style={styles.to} 
        onPress={openDatePicker}>
          <Text style={styles.text2}>Tarih Seçiniz</Text>
      </TouchableOpacity>
      {/* Tarih Gösteren eleman DataPicker */}
      <DatePicker
        isVisible={showDatePicker} //fonsiyonları tanımlıyoruz
        mode={'single'}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
      {//Tarih Seçildiyse Seçilen tarihi göster ve diğer kısımları göster
      tarihSecildiMi==true ? 
      <View style={styles.view}> 
        <Text style={styles.baslik}>Seçilen Tarih : {tarih.gun+"."+tarih.ay+"."+tarih.yil}</Text> 
        <TouchableOpacity style={styles.to} onPress={getBorsa}>
          <Text style={styles.text2}>Verileri Getir</Text>
        </TouchableOpacity>
        <View style={styles.view}>
        {
        data.length > 1 ? //Datanın uzunluğu 1 den büyükse yani veri çekildiyse verileri göster
          <View  style={styles.view}> 
            <Text style={styles.baslik}>Veri Tarihi : {veriTarih}</Text>
            <View>
            <Table borderStyle={{ borderWidth: 2 }}>
              <Row // Tabloları ve verileri göster
                data={['Adet', 'İsmi', 'Alış Fiyat', 'Satış Fiyat']}
                flexArr={flexArr}
                style={styles.head1}
                textStyle={styles.text}
              />
              <Row
                data={[data[0].Unit,data[0].Isim,data[0].ForexBuying,data[0].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[1].Unit,data[1].Isim,data[1].ForexBuying,data[1].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[2].Unit,data[2].Isim,data[2].ForexBuying,data[2].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[3].Unit,data[3].Isim,data[3].ForexBuying,data[3].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[4].Unit,data[4].Isim,data[4].ForexBuying,data[4].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[5].Unit,data[5].Isim,data[5].ForexBuying,data[5].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[6].Unit,data[6].Isim,data[6].ForexBuying,data[6].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[7].Unit,data[7].Isim,data[7].ForexBuying,data[7].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[8].Unit,data[8].Isim,data[8].ForexBuying,data[8].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[9].Unit,data[9].Isim,data[9].ForexBuying,data[9].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[10].Unit,data[10].Isim,data[10].ForexBuying,data[10].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[11].Unit,data[11].Isim,data[11].ForexBuying,data[11].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[12].Unit,data[12].Isim,data[12].ForexBuying,data[12].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[13].Unit,data[13].Isim,data[13].ForexBuying,data[13].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[14].Unit,data[14].Isim,data[14].ForexBuying,data[14].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[15].Unit,data[15].Isim,data[15].ForexBuying,data[15].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[16].Unit,data[16].Isim,data[16].ForexBuying,data[16].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[17].Unit,data[17].Isim,data[17].ForexBuying,data[17].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={[data[18].Unit,data[18].Isim,data[18].ForexBuying,data[18].ForexSelling]}
                flexArr={flexArr}
                style={styles.head}
                textStyle={styles.text}
              />
            </Table>
          </View>
          </View>
        :null // Veri gelmediyse null ekranda bir şey gösterme
        }
      </View>
      </View>
      : //Tarih Seçilmediyse Tarih Seçiniz yazısını göster ekranda
      <View style={styles.view}> 
        <Text style={styles.baslik}>Lütfen Bir Tarih Seçiniz.</Text>
      </View>
      }
    </View>
    );
}

const styles = StyleSheet.create({
  baslik:{
    fontSize:28,
    fontWeight:"bold",
  },
  view:{
    alignItems:"center",
  },
  to:{ 
    width:160,
    margin:5,
    fontWeight:"bold",
    alignItems: "center",
    backgroundColor: "red",
    padding: 5,
    borderRadius:15,
  },
  text2: {
    fontSize:22,
    color:"black",
    fontWeight: "bold",
  },
  container: {
    padding: 16, 
    paddingTop: 100, 
    backgroundColor: '#fff',
  },
  head1: {
     width:365, 
     height: 40, 
     backgroundColor: 'orange',
  },
  head: { 
    width:365, 
    height: 18, 
    backgroundColor: 'lawngreen',
  },
  wrapper: { 
    flexDirection: 'row',
  },
  title: {
    backgroundColor: '#2ecc71',
  },
  row: {
    height: 28,
  },
  text: { 
    fontSize:13,
    textAlign: 'center',
    fontWeight: "bold"
  },
});
export default ListeleScreen;