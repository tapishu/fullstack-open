import Constants from "expo-constants";
import { StyleSheet, View,Image } from "react-native";
import Text from "./Text"
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
  },
    tinyLogo: {
    width: 50,
    height: 50,
  },
topContainer: {
  flexDirection: 'row', // ← これで横並びになる！
  alignItems: 'flex-start',
  marginBottom: 15,
  
},
infoContainer: {
  flex: 1, // 残りの幅を全部使う設定
  marginLeft: 15,
},
statsContainer: {
  flexDirection: 'row',       // ← 横並びにする
  justifyContent: 'space-around', // ← 隙間を均等に開ける
  paddingVertical: 10,
},
statItem: {
  alignItems: 'center',       // 数字とラベルを中央揃えにする
},
language: {
    alignSelf: 'flex-start',       // 文字の長さに合わせる
    backgroundColor: '#0366d6',    // GitHubっぽいきれいな青
    color: 'white',                // 文字を白に
    paddingHorizontal: 8,          // 左右の余白
    paddingVertical: 4,            // 上下の余白
    borderRadius: 4,               // 角を丸くする
    overflow: 'hidden',            // 角丸をきれいに適用させる
    marginTop: 6,                  // 説明文との隙間
  },
});



const RepositoryItem = ({repository}) => {

const formatCount = (counts)=>{
  if(counts >= 1000){
    const newCounts = (counts/1000).toFixed(1)
    return `${newCounts}k`
  }
  return counts
}

  return (
  <View style={styles.repository} testID="repositoryItem">
    <View style={styles.topContainer}>
      <Image
        style={styles.tinyLogo}
        source={{uri:repository.ownerAvatarUrl}}
      />
      <View style={styles.infoContainer}>
    <Text fontWeight="bold">{repository.fullName}</Text>
    <Text color="textSecondary">{repository.description}</Text>
    <Text style={styles.language}>{repository.language}</Text>
    </View>
    </View>
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
    <Text style={styles.stargazersCount}>{formatCount(repository.stargazersCount)}</Text>
    <Text color="textSecondary">stars</Text>
    </View>
    <View style={styles.statItem}>
    <Text style={styles.forksCount}>{formatCount(repository.forksCount)}</Text>
    <Text color="textSecondary">forks</Text>
    </View>
    <View style={styles.statItem}>
    <Text style={styles.reviewCount}>{formatCount(repository.reviewCount)}</Text>
    <Text color="textSecondary">reviews</Text>
    </View>
    <View style={styles.statItem}>
    <Text style={styles.ratingAverage}>{formatCount(repository.ratingAverage)}</Text>
    <Text color="textSecondary">rating</Text>
    </View>
    </View>

  </View>
  );
};

export default RepositoryItem;


