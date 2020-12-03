import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem,Icon } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class BookDonateScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
     allNotification : []
    }
  this.notificationRef= null
  }

  getNotifications=()=>{
      this.notificationRef=db.collection('all_notification').where('notification_status','==','unread')
        .where('targeting_userId','==',this.state.userId).onSnapshot((snapshot)=>{
            var allNotification=[]
            snapshot.docs.map((doc)=>{
                var notification=doc.data()
                notification['doc_id']=doc.id
                allNotification.push(notification)
            })
            this.setState({
                allNotification:allNotification
            })
        })
    }

  componentDidMount(){

    this.getNotifications()
  }

  componentWillUnmount(){
   this.notificationRef()
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.message}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        leftElement={
            <Icon name='Book' color='#123456'></Icon>
        }
       
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Notifications" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allNotification.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>You have no notifications</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allNotification}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
