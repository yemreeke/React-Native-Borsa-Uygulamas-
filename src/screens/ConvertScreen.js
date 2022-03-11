import React,{useState} from 'react';
import {TouchableOpacity,TextInput,Picker,View,Text, StyleSheet,ScrollView,Alert} from 'react-native';
import DatePicker from "react-native-neat-date-picker";
const ConvertScreen = () => {
  const [selectedValue1, setSelectedValue1] = useState("ABD DOLARI"); // Başlangıç olarak ABD Doları seçilidir.
  const [selectedValue2, setSelectedValue2] = useState("ABD DOLARI"); // Başlangıç olarak ABD Doları seçilidir.
  const [selectedIndex1, setSelectedIndex1] = useState(0); // Başlangıç olarak 0.indis seçilidir
  const [selectedIndex2, setSelectedIndex2] = useState(0); // Başlangıç olarak 0.indis seçilidir
  const [showDatePicker, setShowDatePicker] = useState(false); // Tarih seçiciyi göstermek ve gizlemek için değişkem
  const [number, onChangeNumber] = useState(0); // Dönüştürelecek para adetini saklamak için
  const [cevirYazi, setCevirYazi] = useState(null); // Çevirme işlemi yapınca metini saklamak için
  const [veriTarih, setVeriTarih] = useState(); // çektiğimiz verinin tarihini saklamak için değişken
  const [data, setData] = useState([1]); // çektiğimiz veriyi saklamak için değişken
  const [tarihSecildiMi ,setTarihSecildiMi] = useState(false); // Tarih seçildi mi seçilmedi mi anlamak için değişken
  const [tarih, setTarih] = useState({   //Seçtiğimiz Tarih bilgilerini saklamak için değişken dizi olarak saklıyoruz
    "gun":"1",
    "ay":"1",
    "yil":"2000",
  });
  const getBorsa = () => { // Borsadan verileri çekiyoruz.
    // https://yemreeke.com/a.php?url=https://www.tcmb.gov.tr/kurlar/202201/10012022.xml
    // https://www.tcmb.gov.tr/kurlar/202201/10012022.xml
    var gun = tarih.gun;  // Hangi tarihin
    var ay =  tarih.ay;  // verilerini çekeceksek
    var yil = tarih.yil; // onun bilgilerini elde ediyoruz.
    //var proxyUrl = 'https://corsanywhere.herokuapp.com/',
    //o bilgilere göre bir url oluşturuyoruz.
    // xml i react native ile çekemedik
    // dışarıdan bir site ile xml i json veriye dönüştürdük
    // o siteden json veriyi react native ile çektik.
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

  const cevir = ()=>{
    // JSON dan verileri elde ediyoruz.
    //Hangi index seçiliyse o indexe ait veriler elimize geçiyor
       
    // dolar tl
    // tl dolar
    // dolar euro
    
    
    
    var alis ="" ;
    var satis="" ;
    var adet = number;
    // dolar euro seçtik
    // 10 girdik dolar  ile çarpcak 130 lira oldu
    // 10  10 tl yi dolar yapcak 
    if(selectedIndex1==19){
      alis = adet;
      satis = adet;
    }
    else{
      var borsaAdet = data[selectedIndex1].Unit; 
      alis = data[selectedIndex1].ForexBuying/borsaAdet;  
      satis = data[selectedIndex1].ForexSelling/borsaAdet;  
      var str1 = (parseFloat(adet*alis)+0.00001).toString()+"00000";
      var str11 = "";
      for (var i=0 ;i<str1.length;i++){
        if(str1[i]=="."){
          for(var j = 0;j<5;j++,i++){
            str11 = str11 + str1[i];
          }
          break;
        }
        else{
          str11 = str11 + str1[i];
        }
      }
      var str2 = (parseFloat(adet*satis)+0.00001).toString()+"00000";
      var str22 = "";
      for (var i=0 ;i<str2.length;i++){
        if(str2[i]=="."){
          for(var j = 0;j<5;j++,i++){
            str22 = str22 + str2[i];
          }
          break;
        }
        else{
          str22 = str22 + str2[i];
        }
      }
      alis = str11;
      satis = str22;
    }
    //100 dolar kaç tl  kaç eoro 
// 1300 lira / 15   80 eoueo

    // 130 lira oldu 
    var adet1 =alis; 
    var adet2 =satis; 
    
    if(selectedIndex2==19){
      alis = adet1;
      satis = adet2;
    }
    else{
      var borsaAdet = data[selectedIndex2].Unit; 
      alis = data[selectedIndex2].ForexBuying/borsaAdet;  
      satis = data[selectedIndex2].ForexSelling/borsaAdet;  
      var str1 = (parseFloat(adet1/alis)+0.00001).toString()+"00000";
      var str11 = "";
      for (var i=0 ;i<str1.length;i++){
        if(str1[i]=="."){
          for(var j = 0;j<5;j++,i++){
            str11 = str11 + str1[i];
          }
          break;
        }
        else{
          str11 = str11 + str1[i];
        }
      }
      var str2 = (parseFloat(adet2/satis)+0.00001).toString()+"00000";
      var str22 = "";
      for (var i=0 ;i<str2.length;i++){
        if(str2[i]=="."){
          for(var j = 0;j<5;j++,i++){
            str22 = str22 + str2[i];
          }
          break;
        }
        else{
          str22 = str22 + str2[i];
        }
      }
      alis = str11;
      satis = str22;
      
    }

    
    var sembol1 =""
    if(selectedIndex1==19){
      sembol1 = "TL";      
    }
    else{
      sembol1 = data[selectedIndex1]["@attributes"].Kod; //USD TL ...
    }
    var sembol2 =""
    if(selectedIndex2==19){
      sembol2 = "TL";      
    }
    else{
      sembol2 = data[selectedIndex2]["@attributes"].Kod; //USD TL ...
    }

    if(selectedIndex1==selectedIndex2){
      alis = number+".0000";
      satis = number+".0000";
    }


    var text1 = adet+" "+sembol1;
    var text2 = "Adet(Alış):"+alis+" "+sembol2;
    var text3 = "Adet(Satış):"+satis+" "+sembol2;
    const dizi= {"text1":text1,"text2":text2,"text3":text3};
    setCevirYazi(dizi);
  }
  return (
    <ScrollView>
    <View style={styles.container}>
      <TouchableOpacity  //Tarih Seçme butonu
        style={styles.to} 
        onPress={openDatePicker}>
        <Text style={styles.text2}>Tarih Seçiniz</Text>
      </TouchableOpacity>
      <DatePicker // Tarih seçtiğimiz obje
        isVisible={showDatePicker}
        mode={'single'}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
      { // Tarih Seçilince Seçilen tarihi gösteriyor ve verileri getirme butonu gözüküyor
      tarihSecildiMi==true ? 
      <View style={styles.view}> 
        <Text style={styles.baslik}>Seçilen Tarih : {tarih.gun+"."+tarih.ay+"."+tarih.yil}</Text> 
        <TouchableOpacity style={styles.to} onPress={getBorsa}>
          <Text style={styles.text2}>Verileri Getir</Text>
        </TouchableOpacity>
        { // Verinin uzunluğu 1 den büyükse veri çekildiyse veri tarihi ve diğer şeyler gösteriliyor
        data.length > 1 ? 
            <View  style={styles.view}>
              <Text style={styles.baslik}>Veri Tarihi : {veriTarih}</Text>
              <View style={styles.viewYatay}>
                <Text style={styles.baslikTL}>Adet : </Text>
                <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Miktar"
                //keyboardType="numeric"
                />

              </View>
              
              <Picker style={styles.picker} // Para birimlerini seçmek için bir picker kullanıyoruz.
              selectedValue={selectedValue1} 
              onValueChange={(itemValue, itemIndex) =>{
                setSelectedValue1(itemValue); // değişince 
                setSelectedIndex1(itemIndex); // bu değerleri kaydediyoruz..
              }}   // Aşağıda da verileri gösteriyoruz. Valuesi de 0 dan 20 ye kadar yazdık.
              // Bu value değeri ile dizinin indisi arasında bağlantı vardır.
              >
                <Picker.Item label="ABD DOLARI"                        value="0" />
                <Picker.Item label="AVUSTRALYA DOLARI"                 value="1" />
                <Picker.Item label="DANİMARKA KRONU"                   value="2" />
                <Picker.Item label="EURO"                              value="3" />
                <Picker.Item label="İNGİLİZ STERLİNİ"                  value="4" />
                <Picker.Item label="İSVİÇRE FRANGI"                    value="5" />
                <Picker.Item label="İSVEÇ KRONU"                       value="6" />
                <Picker.Item label="KANADA DOLARI"                     value="7" />
                <Picker.Item label="KUVEYT DİNARI"                     value="8" />
                <Picker.Item label="NORVEÇ KRONU"                      value="9" />
                <Picker.Item label="SUUDİ ARABİSTAN RİYALİ"            value="10" />
                <Picker.Item label="JAPON YENİ"                        value="11" />
                <Picker.Item label="BULGAR LEVASI"                     value="12" />
                <Picker.Item label="RUMEN LEYİ"                        value="13" />
                <Picker.Item label="RUS RUBLESİ"                       value="14" />
                <Picker.Item label="İRAN RİYALİ"                       value="15" />
                <Picker.Item label="ÇİN YUANI"                         value="16" />
                <Picker.Item label="PAKİSTAN RUPİSİ"                   value="17" />
                <Picker.Item label="KATAR RİYALİ"                      value="18" />
                <Picker.Item label="TÜRK LİRASI"                       value="19" />
              </Picker>      
              <Picker style={styles.picker2} // Para birimlerini seçmek için bir picker kullanıyoruz.
              selectedValue={selectedValue2} 
              onValueChange={(itemValue, itemIndex) =>{
                setSelectedValue2(itemValue) // değişince 
                setSelectedIndex2(itemIndex) // bu değerleri kaydediyoruz..
              }}   // Aşağıda da verileri gösteriyoruz. Valuesi de 0 dan 20 ye kadar yazdık.
              // Bu value değeri ile dizinin indisi arasında bağlantı vardır.
              >
                <Picker.Item label="ABD DOLARI"                        value="0" />
                <Picker.Item label="AVUSTRALYA DOLARI"                 value="1" />
                <Picker.Item label="DANİMARKA KRONU"                   value="2" />
                <Picker.Item label="EURO"                              value="3" />
                <Picker.Item label="İNGİLİZ STERLİNİ"                  value="4" />
                <Picker.Item label="İSVİÇRE FRANGI"                    value="5" />
                <Picker.Item label="İSVEÇ KRONU"                       value="6" />
                <Picker.Item label="KANADA DOLARI"                     value="7" />
                <Picker.Item label="KUVEYT DİNARI"                     value="8" />
                <Picker.Item label="NORVEÇ KRONU"                      value="9" />
                <Picker.Item label="SUUDİ ARABİSTAN RİYALİ"            value="10" />
                <Picker.Item label="JAPON YENİ"                        value="11" />
                <Picker.Item label="BULGAR LEVASI"                     value="12" />
                <Picker.Item label="RUMEN LEYİ"                        value="13" />
                <Picker.Item label="RUS RUBLESİ"                       value="14" />
                <Picker.Item label="İRAN RİYALİ"                       value="15" />
                <Picker.Item label="ÇİN YUANI"                         value="16" />
                <Picker.Item label="PAKİSTAN RUPİSİ"                   value="17" />
                <Picker.Item label="KATAR RİYALİ"                      value="18" />
                <Picker.Item label="TÜRK LİRASI"                       value="19" />
              </Picker>    


              <TouchableOpacity style={styles.to1} onPress={cevir}>
                <Text style={styles.toText}>Çevir</Text>
              </TouchableOpacity>
              {cevirYazi==null ? null :  // ÇevirYazisi nulldan farklı bir şey ise ekranda göster.
              <View style={styles.view}>
                <Text style={styles.text}>{cevirYazi.text1}</Text>
                <Text style={styles.text2}>{cevirYazi.text2}</Text>
                <Text style={styles.text2}>{cevirYazi.text3}</Text>
              </View>
              }
            </View>
        : null 
        }
      </View>
      :null }
      </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  view:{
    marginVertical:5,
    alignItems:"center",
  },
  viewYatay:{
    flexDirection:"row",
    alignItems:"center",
  },
  baslik:{
    fontSize:20,
    fontWeight:"bold",
  },
  baslikTL:{
    fontSize:35,
    fontWeight:"bold",
  },
  to:{
    width:160,
    margin:5,
    fontWeight:"bold",
    alignItems: "center",
    backgroundColor: "#FF6600",
    padding: 5,
    borderRadius:15,
  },
  picker:{ 
    height: 10, 
    width: 400,
  },
  picker2:{ 
    marginTop:200,
    height: 10, 
    width: 400,
  },
  toText:{
    fontSize:25,
    fontWeight:"bold",
  },
  to1:{
    marginTop:180,
    width:160,
    marginVertical:5,
    alignItems: "center",
    backgroundColor: "#1AFF00",
    padding: 5,
    borderRadius:15,
  },
  container: {
    marginVertical:10,
    alignItems: "center"
  },
  text: {
    fontSize: 30,
  },
  text2: {
    fontSize:20,
    color:"black",
    fontWeight: "bold",
    marginVertical:5,
  },
  input: { // para miktarı girdiğimiz 
    textAlign:"center",
    height: 40,
    width:100,
    margin: 5,
    borderWidth: 2,
    padding: 10,
    fontSize:20,
    fontWeight:"bold",
  },
});

export default ConvertScreen;
