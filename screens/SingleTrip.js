import React, { Component } from 'react';
import { Text, View, Image, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { fetchFlights } from '../store/flight';
import {
  PricingCard,
  Tile,
  Avatar,
  Divider,
  Button,
} from 'react-native-elements';
import { fetchSingleTrip } from '../store/trip';
import { fetchUsers } from '../store/usersPerTrips';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressCircle from 'react-native-progress-circle';

export class SingleTrip extends Component {
  async componentDidMount() {
    this.props.getFlights();
    await this.props.getTrip(this.props.navigation.state.params.location);

    let userIds = [];
    if (this.props.trip.attendees) {
      userIds = [...this.props.trip.attendees];
      userIds.push(this.props.trip.host);
    }
    this.userIds = userIds;
    this.props.getUsers(userIds);
  }

  todoFilter = (todosObj, userId) => {
    const todosPerPerson = [];
    const todoKeys = Object.keys(todosObj);
    todoKeys.forEach(key => {
      todosObj[key].forEach(obj => {
        if (obj.userId === userId) {
          todosPerPerson.push({ [key]: obj.completed });
        }
      });
    });
    return todosPerPerson;
  };

  // eslint-disable-next-line complexity
  render() {
    const { navigate } = this.props.navigation;
    const user = this.props.user;
    const userId = this.props.navigation.state.params.userId;

    const onvertTime = time => {
      let date = new Date(null);
      date.setSeconds(time);
      return date.toString().slice(0, 16);
    };
    const date = this.props.trip.startDate
      ? this.props.trip.startDate.seconds
      : '';
    const date2 = this.props.trip.endDate
      ? this.props.trip.endDate.seconds
      : '';
    const todos = this.props.trip.todos ? this.props.trip.todos : {};
    const usersTodoData = this.userIds
      ? this.userIds.map(id => {
          return { [id]: this.todoFilter(todos, id) };
        })
      : [];
    const usersTodoTotal = [];
    const usersTodos = usersTodoData
      ? usersTodoData.reduce((startArr, userObj) => {
          const userId = Object.keys(userObj);
          const userTodoTotal = userObj[userId].reduce(
            (acc, todo) => {
              const todoKeys = Object.keys(todo);
              acc.user = userId[0];
              todoKeys.forEach(todoKey => {
                todo[todoKey] ? (acc.true += 1) : (acc.false += 1);
              });
              return acc;
            },
            { true: 0, false: 0 }
          );

          usersTodoTotal.push(userTodoTotal);
        }, [])
      : [];
    const percentages = usersTodoTotal
      ? usersTodoTotal.map(obj => {
          return {
            userId: [obj.user][0],
            percentage: (obj.true / (obj.true + obj.false)) * 100,
          };
        })
      : null;
    if (this.props.users) {
      this.props.users.forEach(userObject => {
        percentages.forEach(percentage => {
          if (String(percentage.userId) === String(userObject.userId)) {
            userObject.percentage = percentage.percentage;
            let color;
            if (percentage.percentage > 75) {
              color = '#66cc66';
            } else if (percentage.percentage > 50) {
              color = '#ff9933';
            } else if (percentage.percentage > 25) {
              color = 'blue';
            } else {
              color = 'red';
            }
            userObject.color = color;
          }
        });
      });
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView>
          <View style={{ flex: 1, justifyContent: 'top' }}>
            <Tile
              imageSrc={{ uri: 'https://placeimg.com/320/150/nature' }}
              title={this.props.navigation.state.params.location}
              featured
              caption={`${onvertTime(date)} - ${onvertTime(date2)}`}
              captionStyle={{ fontSize: 16 }}
              height={150}
            />
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.contentContainer}
            >
              {this.props.users ? (
                this.props.users.map(user => (
                  <ProgressCircle
                    percent={Math.floor(user.percentage)}
                    key={user.firstName}
                    radius={20}
                    borderWidth={3}
                    color={user.color}
                    shadowColor="#999"
                    bgColor="#aaaaaa"
                  >
                    <Avatar
                      size="small"
                      key={user.firstName}
                      rounded
                      source={{ uri: `${user.imgUrl}` }}
                      containerStyle={{ marginLeft: 0 }}
                    />
                  </ProgressCircle>
                ))
              ) : (
                <Text>No users</Text>
              )}
            </ScrollView>
            <Divider style={{ backgroundColor: 'gray', marginBottom: 10 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Avatar
                  size="large"
                  rounded
                  icon={{ name: 'check', color: 'white', type: 'font-awesome' }}
                  onPress={() =>
                    navigate('Todos', {
                      todos: this.props.trip.todos,
                      userId: userId,
                      location: this.props.trip.location,

                      users: this.props.users,
                    })
                  }
                  activeOpacity={0.7}
                  containerStyle={{ marginLeft: 15, marginTop: 5 }}
                  avatarStyle={{ backgroundColor: '#ff9933' }}
                />
                <Text style={styles.text}>Todos</Text>
              </View>
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Avatar
                  size="large"
                  rounded
                  icon={{ name: 'plane', color: 'white', type: 'font-awesome' }}
                  onPress={() =>
                    navigate('Flights', { flights: this.props.flights })
                  }
                  activeOpacity={0.7}
                  containerStyle={{ marginLeft: 15, marginTop: 5 }}
                  avatarStyle={{ backgroundColor: '#66cc66' }}
                />
                <Text style={styles.text}>Flights</Text>
              </View>
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Avatar
                size="large"
                rounded
                icon={{
                  name: 'calendar',
                  color: 'white',
                  type: 'font-awesome',
                }}
                onPress={() =>
                  navigate('Itinerary', {
                    trip: this.props.trip,
                    users: this.userIds,
                    location: this.props.navigation.state.params.location,
                  })
                }
                activeOpacity={0.7}
                containerStyle={{
                  marginLeft: 15,
                  marginTop: 5,

                }}
              />
              <Text style={styles.text}>Itinerary</Text>
              </View>
            </View>
          </View>
          <Divider style={{ backgroundColor: 'gray', marginTop: 20 }} />
          <Text style={{ marginTop: 30, marginLeft: 15, fontSize: 20 }}>
            Recent activity
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={25} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Howl', { user, userId })}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={25} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={25} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Profile', { user })}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 15,
    paddingLeft: 10,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    fontWeight: 'bold',
    marginTop: 5,
    paddingLeft: 5
  },
});

const mapState = state => {
  return {
    flights: state.flight,
    trip: state.trip.selectedTrip,
    users: state.users,
    user: state.user.user,
  };
};

const mapDispatch = dispatch => {
  return {
    getFlights: () => dispatch(fetchFlights()),
    getTrip: tripName => dispatch(fetchSingleTrip(tripName)),
    getUsers: userIds => dispatch(fetchUsers(userIds)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(SingleTrip);
