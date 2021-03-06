import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Button, Avatar, Divider } from 'react-native-elements';
import firebase from '../server/config';

export default class RecentActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    const db = firebase.firestore();
    const query = await db.collection('users').get();
    const users = await query.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    this.setState({ users });
  }

  render() {
    const { selectedTrip } = this.props;
    const { users } = this.state;
    return (
      <View style={{ marginTop: 15, marginBottom: 100 }}>
        {selectedTrip.bookedFlights && selectedTrip.bookedFlights.length ? (
          selectedTrip.bookedFlights.map((flight, idx) => (
            <View
              key={idx}
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 10,
                marginBottom: 120,
              }}
            >
              <View style={{ width: 35, height: 50 }}>
                <Avatar
                  rounded
                  size="small"
                  source={{
                    uri:
                      users && users.length
                        ? users.filter(
                            user => user.id === flight.userId && user.imgUrl
                          )[0].imgUrl
                        : '',
                  }}
                />
              </View>
              <View style={{ width: 310, height: 50, marginLeft: 5 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    fontFamily: 'Verdana',
                    paddingBottom: 5,
                  }}
                >
                  {users && users.length
                    ? users.filter(user => user.id === flight.userId)[0]
                        .firstName + ' booked a flight!'
                    : ''}
                </Text>
                <View
                  style={{
                    backgroundColor: '#fefcf5',
                    borderColor: '#dbdbdb',
                    borderWidth: 1,
                    borderRadius: 5,
                    flexDirection: 'row',
                  }}
                >
                  <View
                    key={idx}
                    style={{
                      width: 70,
                      height: 100,
                      marginTop: 10,
                      marginLeft: 10,
                    }}
                  >
                    <ListItem
                      title={flight.startAirport}
                      leftIcon={{
                        name: 'flight-takeoff',
                        marginRight: 0,
                        paddingRight: 0,
                      }}
                      containerStyle={{
                        padding: 0,
                        paddingBottom: 5,
                        justifyContent: 'top',
                        backgroundColor: '#fefcf5',
                      }}
                      contentContainerStyle={{
                        padding: 0,
                        justifyContent: 'top',
                      }}
                      titleStyle={{
                        fontSize: 14,
                        justifyContent: 'flex-start',
                      }}
                    />

                    <Divider
                      style={{
                        backgroundColor: 'gray',
                        marginBottom: 10,
                        marginTop: 30,
                      }}
                    />
                    <ListItem
                      title={flight.endAirport}
                      leftIcon={{ name: 'flight-takeoff', paddingRight: 0 }}
                      containerStyle={{
                        padding: 0,
                        paddingBottom: 5,
                        justifyContent: 'top',
                        backgroundColor: '#fefcf5',
                      }}
                      contentContainerStyle={{
                        padding: 0,
                        justifyContent: 'top',
                      }}
                      titleStyle={{
                        fontSize: 14,
                        justifyContent: 'flex-start',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: 140,
                      height: 100,
                      marginTop: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      type="clear"
                      title={flight.outbound}
                      titleStyle={{
                        color: 'gray',
                        fontWeight: 'bold',
                        fontSize: 14,
                        margin: 0,
                        padding: 0,
                      }}
                      buttonStyle={{ margin: 0, padding: 0 }}
                    />

                    <Text style={{ color: 'gray' }}>Outbound</Text>
                    <Divider
                      style={{
                        backgroundColor: 'gray',
                        marginBottom: 5,
                        marginTop: 5,
                      }}
                    />
                    <Button
                      type="clear"
                      title={flight.inbound}
                      titleStyle={{
                        color: 'gray',
                        fontWeight: 'bold',
                        fontSize: 14,
                        margin: 0,
                        padding: 0,
                      }}
                      buttonStyle={{ margin: 0, padding: 0 }}
                    />
                    <Text style={{ color: 'gray' }}>Inbound</Text>
                  </View>
                  <View
                    style={{
                      width: 90,
                      height: 100,
                      marginTop: 10,
                      marginLeft: 5,
                      marginRight: 0,
                    }}
                  >
                    <ListItem
                      title={flight.endAirport}
                      leftIcon={{ name: 'flight-land' }}
                      containerStyle={{
                        padding: 0,
                        paddingBottom: 5,
                        justifyContent: 'top',
                        backgroundColor: '#fefcf5',
                        width: 80
                      }}
                      contentContainerStyle={{
                        padding: 0,
                        justifyContent: 'top',
                      }}
                      titleStyle={{
                        fontSize: 14,
                        justifyContent: 'flex-start',
                      }}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: '#66cc66',
                      }}
                    >
                      ${flight.price}
                    </Text>
                    <Divider
                      style={{
                        backgroundColor: 'gray',
                        marginBottom: 10,
                        marginTop: 10,
                        marginRight: 10,
                      }}
                    />
                    <ListItem
                      title={flight.startAirport}
                      leftIcon={{ name: 'flight-land' }}
                      containerStyle={{
                        padding: 0,
                        paddingBottom: 5,
                        justifyContent: 'top',
                        backgroundColor: '#fefcf5',
                        width: 80
                      }}
                      contentContainerStyle={{
                        padding: 0,
                        justifyContent: 'top',
                      }}
                      titleStyle={{
                        fontSize: 14,
                        justifyContent: 'flex-start',
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ marginLeft: 15, fontSize: 16, fontFamily: 'Verdana' }}>
            No flights booked yet!
          </Text>
        )}
      </View>
    );
  }
}
