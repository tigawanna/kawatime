import { StyleSheet } from 'react-native'
import { Text,Surface, Button } from 'react-native-paper';
 
export default function settings(){
return (
<Surface style={{ ...styles.container }}>
    <Text variant='titleLarge'>settings</Text>
    <Text variant='bodyLarge'>This is the settings screen</Text>
    <Button mode="contained" onPress={() => {}}>Logout</Button>
</Surface>
);
}
const styles = StyleSheet.create({
container:{
  flex:1,
  height:'100%',
   width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
})
