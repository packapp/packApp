import React, {Component} from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, SectionList } from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../server/config';
import { fetchAlphaTrips, fetchPackTrips } from '../store/trip';
import { connect } from 'react-redux';

class Howl extends Component {
  static navigationOptions = {
    title: 'Howls'
  }

  constructor(props) {
    super(props);
    this.usersRef = firebase.firestore().collection('users');
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.unsubscribeUsers = this.usersRef.onSnapshot(this.onCollectionUpdate);
    this.props.fetchAlphaTrips(this.props.navigation.state.params.userId);
    this.props.fetchPackTrips(this.props.navigation.state.params.userId);
  }

  componentWillUnmount() {
    this.unsubscribeUsers();
  }

  onCollectionUpdate = (querySnapshot) => {
    const users = [];
    querySnapshot.forEach(doc => {
      users.push(doc.data());
    });
    this.setState({
      users
    });
  }

  renderUserItem = ({item}) => {
    const user = this.props.navigation.state.params.user;
    return(
      item.email !== user.email ?
        <TouchableOpacity key={item.firstName} style={styles.divider} onPress={() => this.props.navigation.navigate('HowlChat', {item, user})}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        </TouchableOpacity>
      : null
    );
  }

  renderTripItem = ({item}) => {
    const user = this.props.navigation.state.params.user;
    return (
      <TouchableOpacity key={item.location} style={styles.divider} onPress={() => this.props.navigation.navigate('HowlGroup', {item, user})}>
        <Text style={styles.name}>{item.location}</Text>
      </TouchableOpacity>
    );
  }

  render(){
    const user = this.props.navigation.state.params.user;
    return(
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        {
          this.state.users && this.props.alpha && this.props.pack ?
          <SectionList
            renderItem={this.renderUserItem}
            renderSectionHeader={({section: {title}}) => (
              <Text style={{color: '#ff9933', fontWeight: 'bold', paddingLeft: 10}}>{title}</Text>
            )}
            sections={[
              {title: 'Friends', data: this.state.users},
              {title: 'Alpha Trips', data: this.props.alpha, renderItem: this.renderTripItem},
              {title: 'Trips', data: this.props.pack, renderItem: this.renderTripItem}
            ]}
            keyExtractor={(item, index) => item + index}
          />
          : null
        }
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={25} color="black"/>} />
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={25} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={25} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Profile', { user })}/>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    alpha: state.trip.alpha,
    pack: state.trip.pack
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAlphaTrips: (userId) => dispatch(fetchAlphaTrips(userId)),
    fetchPackTrips: (userId) => dispatch(fetchPackTrips(userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Howl);

const styles = StyleSheet.create({
  container: {
    height: 250
  },
  divider: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  name: {
    fontSize: 20
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30
  }
});
