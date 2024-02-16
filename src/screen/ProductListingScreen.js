import React, { useEffect, useState } from "react";
import {  SafeAreaView, FlatList, } from "react-native";
import HeaderComponent from "../component/HeaderComponent";
import ProductComponent from "../component/ProductComponent";
import Loader from "../component/Loader";
import Preferences from "../component/LocalStorage";

const ProductListingScreen = () => {
  let data = [
    { id: 1, },
    { id: 1, },
    { id: 1, },
    { id: 1, },
    { id: 1, },
    { id: 1, },
    { id: 1, },
    { id: 1, },

  ]
  const [list, setList] = useState([])
  const [cart, setCart] = useState([])
  const [switchLanguage, setSwitchLanguage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [totalProduct, setTotalProduct] = useState(0)
  const [paginationLoader,setPaginationLoader] = useState(false)
  const [datas,setDatas] = useState([])
  const [toggleButton,setToggleButton] = useState(true)

  useEffect(() => {
    Preferences.getItem('count').then((response)=>{
      setCart(JSON.parse(response))
    })
    // Preferences.removeItem('count')
    // Preferences.removeItem('languages')
    Preferences.getItem('languages').then((response)=>{
      console.log("local data===",JSON.parse(response))
        setSwitchLanguage(JSON.parse(response))
    })

    if (switchLanguage === true) {
      getListApi('en')
    } else  {
      console.log("2")
      getListApi('ar')
    }
   
  }, [])

  const getListApi = (language) => {
      setLoading(true) 
    return fetch(`https://shopifyapptst1.bma.ae/react-native-exercise/?lang=${language}`)
    .then(response => response.json())
    .then(json => {
      setLoading(false)
      console.log("length====",json.data.products.length)
      // setDatas(json.data.products)
      setList(json.data.products)
      // loadProduct(json.data.products)
      setTotalProduct(item?.data?.total_product)

    })
    .catch(error => {
      console.error(error);
    });
  };
 

  // loadProduct = (data) => {
  //   let newArray = []
  //   data.map((response,index)=>{
  //       if(index<10) {
  //         newArray.push(response)
  //         setList(newArray)
  //       }
  //   }) 
  //  }

   loadMoreProduct = (data) => {
       if(data && list.length<16){
           let newArray = [...list]
           setPaginationLoader(false)
           datas.map((response,index)=>{
            setPaginationLoader(true)
               if(index>10&&index <16&&list.length<16) {
                newArray.push(response)
                setList(newArray)
               }
           })
       }
   }
  

  const addToCard = (item) => {
    let newArray = [...cart]
   
      newArray.push(item)
      setCart(newArray)
      Preferences.setItem('count',JSON.stringify(cart))
      console.log("item ===", cart.length)
    
  }
  languageSwitch = () => {
    setSwitchLanguage(!switchLanguage)
  }


  useEffect(() => {
    if (switchLanguage) {
      getListApi('en')
      Preferences.setItem("languages",JSON.stringify(switchLanguage))
    } else {
      getListApi('ar')
      Preferences.setItem("languages",JSON.stringify(switchLanguage))
    }
  }, [switchLanguage])



  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        loading ? (<Loader />) : (
          <>
            <HeaderComponent
              count={cart.length}
              switchs={switchLanguage}
              languageSwitch={()=>languageSwitch()}
              totalProduct = {totalProduct}
            />
            <FlatList
              data={list}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <ProductComponent
                    item={item}
                    onPressbag={() => addToCard(item)}
                    switchs={switchLanguage}
                  />
                )
              }}
              style={{ alignSelf: 'center' }}
              numColumns={2}

              // onEndReachedThreshold={0.5}
              // maxToRenderPerBatch={10}
              // // estimatedItemSize={50}
              // onEndReached={()=>loadMoreProduct(true)}
              // contentContainerStyle={{
              //   justifyContent: "space-between",
              //   paddingBottom: 100,
              // }}
              // ListFooterComponent={
              //   paginationLoader && (
              //      <Loader/>
              //   )
              // }
              // showsVerticalScrollIndicator={false}
            />
          </>
        )
      }
    </SafeAreaView>
  )
}

export default ProductListingScreen