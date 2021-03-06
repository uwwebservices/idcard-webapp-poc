import React from 'react';
import ContentModal from 'Components/ContentModal';

class RegistrationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      showLogout: false,
      executeOnce: false,
      showApproveButton: true,
      showCancelButton: true
    };
  }
  render() {
    let modalOpts = {
      openWithButton: true,
      dialogTitle: 'Start Registation Mode',
      cancelButtonText: 'Back',
      approveButtonText: 'Start Registration',
      openButtonText: 'Registration Mode',
      disableBackdropClick: true,
      showApproveButton: this.state.showApproveButton,
      showCancelButton: this.state.showCancelButton,
      ...this.props
    };

    modalOpts.confirmCallback = async () => {
      this.setState({ showLogout: true, count: this.state.count + 1, showApproveButton: false, showCancelButton: false });
      // Wait until the logout works OR we've tried too many times
      // This should allow the iFrame to load
      let count = 0;
      const maxCount = 10;
      // this.state.count keeps track of renders of the modal, after it has re-rendered twice the iframe is loaded
      // this is probaby janky but I can't think of a better way since iFrames are dumb.
      while (this.state.count < 2 || count >= maxCount) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        count += 1;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Make sure we only call startRegistration once
      // Also probably janky, but consistently janky
      if (!this.state.executeOnce) {
        this.setState({ executeOnce: true });
        if (this.props.startRegistration) {
          this.props.startRegistration();
        } else if (this.props.endRegistration) {
          this.props.endRegistration();
        }
      }
    };

    return (
      <ContentModal {...modalOpts}>
        <div>{this.state.showLogout ? <iframe onLoad={modalOpts.confirmCallback} src="https://idp.u.washington.edu/idp/profile/Logout" height="335px" width="450px" /> : this.props.children}</div>
      </ContentModal>
    );
  }
}

export default RegistrationModal;
