import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

export class Todos extends Component {
  render(){
    const {todos} = this.props.navigation.state.params
    const user = this.props.user
    console.log('TODOS', todos)
    const keys = todos ? Object.keys(todos) : ''
    return(
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View>
            {keys ? keys.map((elem, idx) => (
              <ListItem key={idx}
                leftIcon={{name: 'check', color: 'orange', type: 'font-awesome'}}
                title={elem}
                subtitle={ todos ? todos[elem].filter((elem) => (
                  elem.completed === false
                )).length + ' people need to complete this task' : <Text>All done</Text>}
                />
            )) : <Text>No todos</Text>}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Howl', { user })}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Profile', { user })}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30,
  },
});

const mapState = state => {
  return {
    user: state.user.user,
  };
};

export default connect(
  mapState,
  null
)(Todos);
