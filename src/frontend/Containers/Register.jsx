import React, { Component } from 'react';
import AddMemberForm from 'Components/AddMemberForm';
import Members from 'Components/Members';
import { connect } from 'react-redux';
import { LoadUsers, AddUser, DeleteUser } from '../Actions';

class Register extends Component {
    render() {
        return (
            <div>
                  <h1>Event Registration</h1>                  
                  <AddMemberForm addUser={this.props.addUser} group={this.props.groupName} />
                  <Members members={this.props.users} reloadUsers={this.props.loadUsers} removeUser={this.props.removeUser} group={this.props.groupName} authenticated={this.props.authenticated} />
          </div>
        )
    }
}

const mapStateToProps = state => ({
    groupName: state.groupName,
    users: state.users,
    groupNameBase: state.config.groupNameBase,
    authenticated: state.authenticated
 });
 const mapDispatchToProps = dispatch => {
     return {
        loadUsers: group => dispatch(LoadUsers(group)),
        addUser: (group, user) => dispatch(AddUser(group, user)),
        removeUser: (group, user) => dispatch(DeleteUser(group, user))
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(Register);