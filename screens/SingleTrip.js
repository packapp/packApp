import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { fetchFlights } from '../store/flight';
import { Icon, Tile, Avatar, Divider, Button } from 'react-native-elements';
import { fetchSingleTrip } from '../store/trip';
import { fetchUsersPerTrip } from '../store/usersPerTrips';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressCircle from 'react-native-progress-circle';
import RecentActivity from './RecentActivity';
import firebase from '../server/config';
import Dialog from 'react-native-dialog';

export class SingleTrip extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <Button
          onPress={() => navigation.goBack()}
          type="clear"
          icon={<Icon name="chevron-left" size={30} />}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('trips');
    this.unsubscribe = null;
    this.state = {
      removeSelfAlert: false,
<<<<<<< HEAD
=======
      tripData: {}
>>>>>>> master
    };
  }

  async componentDidMount() {
    await this.props.getTrip(this.props.navigation.state.params.location);
    const endAirport = this.props.trip.endAirport.toString();
    const startAirport = this.props.trip.startAirport.toString();

    let userIds = [];
    if (this.props.trip.attendees) {
      userIds = [...this.props.trip.attendees];
      userIds.push(this.props.trip.host);
    }
    this.userIds = userIds;
    this.props.getUsers(userIds);

    const date = this.props.trip.startDate
      ? this.props.trip.startDate.seconds
      : '';
    const date2 = this.props.trip.endDate
      ? this.props.trip.endDate.seconds
      : '';

    const convertTime = time => {
      let newDate = new Date(null);
      newDate.setSeconds(time);
      return newDate.toString().slice(0, 16);
    };

    const test = date => {
      const dates = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
      };

      const oldDate = convertTime(date);
      const month = oldDate.slice(4, 7);
      let newDate = oldDate
        .split(' ')
        .reverse()
        .join(' ')
        .slice(1, 12)
        .split(' ');
      let result = `${newDate[0]}-${dates[month]}-${newDate[1]}`;
      return result;
    };
    const startDate = test(date);
    const endDate = test(date2);
    this.props.getFlights(endAirport, startAirport, startDate, endDate);
    this.setState({
      tripData: this.props.trip
    });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = async(querySnapshot) => {
    let tripData = {};
    const location = this.props.navigation.state.params.location;
    await querySnapshot.forEach(doc => {
      if (doc.id === location) {
        tripData = doc.data();
      }
    });
    this.setState({
      tripData
    });
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

  async leaveThePack() {
    const { navigate } = this.props.navigation;
    const userId = this.props.navigation.state.params.userId;
    try {
      const db = firebase.firestore();
      const tripRef = db.collection('trips').doc(this.props.trip.location);
      const query = await tripRef.get();
      const attendees = query.data().attendees;
      const newAttendees = attendees.filter(attendee => {
        return attendee !== userId;
      });

      await tripRef.update({
        attendees: newAttendees,
      });

      navigate('Dashboard');
    } catch (err) {
      console.error(err);
    }
  }
  // eslint-disable-next-line complexity
  render() {
    console.log(this.props.users);
    const { navigate } = this.props.navigation;
    const { tripData } = this.state;
    const user = this.props.user;
    const userId = this.props.navigation.state.params.userId;

    const convertTime = time => {
      let date = new Date(null);
      date.setSeconds(time);
      return date.toString().slice(0, 16);
    };
    const date = tripData.startDate
      ? tripData.startDate.seconds
      : '';
    const date2 = tripData.endDate
      ? tripData.endDate.seconds
      : '';
    const todos = tripData.todos ? tripData.todos : {};
    const usersTodoData = this.userIds
      ? this.userIds.map(id => {
          return { [id]: this.todoFilter(todos, id) };
        })
      : [];
    const usersTodoTotal = [];
    const usersTodosData = {};
    const usersTodos = usersTodoData
      ? usersTodoData.reduce((startArr, userObj) => {
          const userId = Object.keys(userObj);
          const userTodoTotal = userObj[userId].reduce(
            (acc, todo) => {
              const todoKeys = Object.keys(todo);
              acc.user = userId[0];
              todoKeys.forEach(todoKey => {
                todo[todoKey] ? (acc.true += 1) : (acc.false += 1);
                if (!usersTodosData[userId]) {
                  usersTodosData[userId] = [];
                }
                usersTodosData[userId].push({
                  taskName: todoKey,
                  complete: todo[todoKey],
                });
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
              color = '#3e88d6';
            } else if (percentage.percentage > 25) {
              color = '#ff9933';
            } else {
              color = '#ed4337';
            }
            userObject.color = color;
          }
        });
        Object.keys(usersTodosData).forEach(key => {
          if (key === userObject.userId) {
            userObject.todoList = usersTodosData[key];
          }
        });
      });
    }
    if (this.props.users)
      return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
          <ScrollView>
            <View style={{ flex: 1, justifyContent: 'top' }}>
              <Tile
                imageSrc={{ uri: this.props.trip.imageUrl }}
                title={this.props.navigation.state.params.location}
                featured
                caption={`${convertTime(date)} - ${convertTime(date2)}`}
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
                      shadowColor="#e9e9e9"
                      bgColor="#aaaaaa"
                    >
                      <Avatar
                        size="small"
                        key={user.firstName}
                        rounded
                        source={user.imgUrl ? { uri: `${user.imgUrl}` } : ''}
                        title={
                          user.imgUrl
                            ? ''
                            : `${user.firstName[0] + user.lastName[0]}`
                        }
                        containerStyle={{ marginLeft: 0 }}
                        avatarStyle={{
                          borderColor: '#f8f8f8',
                          borderWidth: 1,
                          borderRadius: 17,
                        }}
                        onPress={() =>
                          navigate('SingleTodos', {
                            todos: user.todoList,
                          })
                        }
                      />
                    </ProgressCircle>
                  ))
                ) : (
                  <Text>No users</Text>
                )}
                <View style={{ alignSelf: 'flex-end' }}>
                  <Avatar
                    size="small"
                    rounded
                    icon={{
                      name: 'plus',
                      color: '#66cc66',
                      type: 'font-awesome',
                    }}
                    onPress={() =>
                      navigate('AddNewPerson', {
                        location: this.props.navigation.state.params.location,
                      })
                    }
                    activeOpacity={0.7}
                    containerStyle={{
                      marginLeft: 15,
                      marginTop: 0,
                    }}
                    avatarStyle={{ backgroundColor: '#f8f8f8' }}
                  />
                </View>
              </ScrollView>
              <Divider style={{ backgroundColor: 'gray', marginBottom: 10 }} />
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    size="large"
                    rounded
                    icon={{
                      name: 'check',
                      color: 'white',
                      type: 'font-awesome',
                    }}
                    onPress={() =>
                      navigate('Todos', {
                        todos: tripData.todos,
                        userId: userId,
                        location: tripData.location,

                        users: this.props.users,
                      })
                    }
                    activeOpacity={0.7}
                    containerStyle={{ marginLeft: 15, marginTop: 5 }}
                    avatarStyle={{ backgroundColor: '#ff9933' }}
                  />
                  <Text style={styles.text}>Todos</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    size="large"
                    rounded
                    icon={{
                      name: 'plane',
                      color: 'white',
                      type: 'font-awesome',
                    }}
                    onPress={() =>
                      navigate('Flights', {
                        flights: this.props.flights,
                        userId: userId,
                        trip: this.props.navigation.state.params.location,
                      })
                    }
                    activeOpacity={0.7}
                    containerStyle={{ marginLeft: 15, marginTop: 5 }}
                    avatarStyle={{ backgroundColor: '#66cc66' }}
                  />
                  <Text style={styles.text}>Flights</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
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
                        trip: tripData,
                        users: this.userIds,
                        location: this.props.navigation.state.params.location,
                        userId: userId,
                      })
                    }
                    activeOpacity={0.7}
                    containerStyle={{
                      marginLeft: 15,
                      marginTop: 5,
                    }}
                    avatarStyle={{ backgroundColor: '#3e88d6' }}
                  />
                  <Text style={styles.text}>Itinerary</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    size="large"
                    rounded
                    icon={{
                      name: 'yelp',
                      color: 'white',
                      type: 'font-awesome',
                    }}
                    onPress={() =>
                      navigate('Activities', {
                        airportCode: tripData.endAirport,
                        navigate: navigate,
                        user: user,
                        userId: userId,
                        users: this.userIds,
                        trip: tripData,
                        itin: tripData.itinerary,
                      })
                    }
                    activeOpacity={0.7}
                    containerStyle={{
                      marginLeft: 15,
                      marginTop: 5,
                      marginRight: 15,
                    }}
                    avatarStyle={{ backgroundColor: 'red' }}
                  />
                  <Text style={styles.text2}>Activities</Text>
                </View>
              </View>
            </View>
            <Divider style={{ backgroundColor: 'gray', marginTop: 20 }} />
            <Text
              style={{
                marginTop: 20,
                marginLeft: 15,
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Verdana',
              }}
            >
              Pack flights
            </Text>
            <View>
              <RecentActivity
                trip={this.props.navigation.state.params.location}
                selectedTrip={tripData}
              />
            </View>
            {userId !== tripData.host ? (
              <View
                style={{
                  justifyContent: 'flex-end',
                  marginBottom: 65,
                  alignSelf: 'center',
                }}
              >
                <Button
                  buttonStyle={{
                    backgroundColor: '#ff9933',
                    borderRadius: 50,
                    alignSelf: 'center',
                    padding: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    bottom: 0,
                  }}
                  onPress={() => this.setState({ removeSelfAlert: true })}
                  title="Leave the pack"
                />
              </View>
            ) : null}
            <View>
              <Dialog.Container visible={this.state.removeSelfAlert}>
                <Dialog.Title>
                  Remove yourself from{' '}
                  {this.props.navigation.state.params.location}?
                </Dialog.Title>
                <Dialog.Button
                  label="Cancel"
                  onPress={() => this.setState({ removeSelfAlert: false })}
                />
                <Dialog.Button label="OK" onPress={() => this.leaveThePack()} />
              </Dialog.Container>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button
              style={styles.navBtns}
              type="clear"
              icon={
                <Ionicons name="ios-chatbubbles" size={25} color="#aaaaaa" />
              }
              onPress={() =>
                this.props.navigation.navigate('Howl', { user, userId })
              }
            />
            <Button
              style={styles.navBtns}
              type="clear"
              icon={<Ionicons name="ios-home" size={25} color="#aaaaaa" />}
              onPress={() => this.props.navigation.navigate('Dashboard')}
            />
            <Button
              style={styles.navBtns}
              type="clear"
              icon={<Ionicons name="ios-person" size={25} color="#aaaaaa" />}
              onPress={() =>
                this.props.navigation.navigate('Profile', { user, userId })
              }
            />
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 15,
    paddingLeft: 10,
    flex: 2,
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
    paddingLeft: 5,
    fontFamily: 'Verdana',
  },
  text2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    fontWeight: 'bold',
    marginTop: 5,
    paddingLeft: 5,
    fontFamily: 'Verdana',
  },
  removeBtn: {
    marginRight: 8,
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
    getFlights: (endAirport, startAirport, startDate, endDate) =>
      dispatch(fetchFlights(endAirport, startAirport, startDate, endDate)),
    getTrip: tripName => dispatch(fetchSingleTrip(tripName)),
    getUsers: userIds => dispatch(fetchUsersPerTrip(userIds)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(SingleTrip);
