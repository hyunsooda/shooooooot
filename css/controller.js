
import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';

const ListExampleSimple = () => (
  <MuiThemeProvider>
    <List>
      <ListItem primaryText="ball1" leftAvatar={<Avatar src="../images/ball1.png" />}/>
      <ListItem primaryText="ball2" leftAvatar={<Avatar src="../images/ball2.png" />}/>
      <ListItem primaryText="ball3" leftAvatar={<Avatar src="../images/ball3.png" />}/>
      <ListItem primaryText="ball4" leftAvatar={<Avatar src="../images/ball4.png" />}/>
    </List>

  </MuiThemeProvider>
);

ReactDOM.render(
  <ListExampleSimple/>,
  document.getElementById('List')
)


/*
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

const App = () => (
  <MuiThemeProvider>
    <AppBar
    title="Title"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App width='200'/>,
  document.getElementById('AppBar')
);
*/

/*
밑에처럼 컴파일하면 require또 깔아야되고 다른 의존성들 많아져서 귀찮아짐. 차라리 webpack으로 한큐에 끝내는게 훨씬 건강상태에 이로움.
compile command
babel controller.js --out-file compiled-controller.js --plugins=transform-react-jsx --presets=es2015
*/




