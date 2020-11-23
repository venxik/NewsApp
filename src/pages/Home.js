import React, { useEffect } from "react"
import {
  View,
  FlatList,
  Linking,
  Text,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../component/Header';
import News from '../component/NewsCell';
import { topOrBottom } from '../config/config_layout';
import useHandleScroll from '../hooks/useHandleScroll';
import FloatingButton from '../component/FloatingButton';
import { useDispatch, useSelector } from 'react-redux';
import { addReadingList } from '../redux/actions/readingList';
import { fetchNewsData } from "../redux/actions/getNewsData";
import uuid from 'react-uuid'
import LoadingBlocker from '../component/LoadingBlocker';

const Home = ({ navigation }) => {
  const { handleScroll, showButton } = useHandleScroll()
  const dispatch = useDispatch()
  const { isFetching, error, newsData } = useSelector(state => state.news_data);

  useEffect(() => {
    dispatch(fetchNewsData());
    console.log(newsData);
  }, []);

  const noData = () => {
    if (!isFetching)
      return (
        <View
          style={styles.MainContainer}
        >
          <Text style={{ textAlign: 'center' }}> Sorry, No Data</Text>
        </View>
      )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        isFetching &&
        <LoadingBlocker />
      }
      <Header headerTitle={"Berita Terkini"} />
      <FlatList
        data={newsData}
        keyExtractor={(item, index) => index.toString()}
        onScroll={handleScroll.bind(this)}
        contentContainerStyle={{ paddingBottom: topOrBottom }}
        ListEmptyComponent={noData()}
        renderItem={({ item, index }) => {
          const { title, description, url, urlToImage } = item
          return (
            <News id={index}
              title={title}
              onPressTitle={() => Linking.openURL(url)}
              onPressBookMark={() => {
                dispatch(addReadingList({
                  ...item, book_mark_id: uuid()
                }))
              }}
              description={description}
              imageLink={urlToImage} />
          )
        }} />
      {
        showButton && !isFetching &&
        <FloatingButton onPress={() => navigation.push("HomeReadingList")} />
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
export default Home
