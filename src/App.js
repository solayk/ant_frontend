import React, { useEffect, useState } from "react";

import Layout from "./components/layout";
import Header from "./components/common/header";
import HeroSection from "./components/homepage/HeroSection";
import SearchPanel from "./components/ants/SearchPanel";
import MainPanels from "./components/ants/MainPanels";
import Introducing from "./components/homepage/Introducing";
import Footer from "./components/homepage/Footer";
import { Route, Switch, useHistory } from 'react-router-dom';
import Login from "./components/ants/Login/Login";
import Register from "./components/ants/Login/Register";
import Indicators from "./components/ants/Indicators";
import Backtest from "./components/ants/Backtest";
import Backtest2 from "./components/ants/back/Backtest2";
import Backtest3 from "./components/ants/back/Backtest3";
import IndicatorDetail from "./components/ants/IndicatorCompo/IndiDetail/pages/IndicatorDetail";
import IndicatorDetail1 from "./components/ants/IndicatorCompo/IndiDetail/pages/IndicatorDetail1";
import IndicatorDetail2 from "./components/ants/IndicatorCompo/IndiDetail/pages/IndicatorDetail2";
import IndicatorDetailExeFor from "./components/ants/IndicatorCompo/IndiDetail/pages/IndicatorDetailExeFor";
import CommentUsdkrw2 from "./components/ants/IndicatorCompo/IndiDetail/pages/CommentUsdkrw2";


import Payment from "./components/ants/Payment";
import PaymentSub from "./components/ants/PaymentSub";
import PaymentFirst from "./components/ants/PaymentFirst";
import Community from "./components/ants/Community";
import News from "./components/ants/News";
import NewsDetail from "./components/ants/NewsDetail";
import Stocks from "./components/ants/Stocks";
import UserApiService from "./api/UserApi";
import SearchResult from "./components/ants/SearchResult";
import BlockTest from "./components/test/BlockTest";
import Profile from "./components/ants/Profile";
import ChatPage from "./components/ChatPage/ChatPage";
import Logout from "./components/ants/Logout";

import BoardApiService from "./api/BoardApi";
import DeclareApiService from "./api/DeclareApi";

import { useDispatch, useSelector } from 'react-redux';
import { setUserLoginCheck, setUserLogout, setUser, setSavedBoards, setLikedComments, setLikedBoards, setDeclareData } from './redux/actions/user_action';

import firebase from "./firebase";

function App() {
  const dispatch = useDispatch();
  let history = useHistory();

  const loginstate = useSelector(state => state.user.loginstate);
  let [storageCheck, storageCheckChange] = useState(false);

  useEffect(() => {
    console.log('1');
    initializeUserInfo();
  },[localStorage.getItem('userid')]);

  // 새로고침시 Redux State 세팅
  function initializeUserInfo() {

    var user_id = localStorage.getItem('userid');

    if (!user_id) {
      dispatch(setUserLogout());
      storageCheckChange(true);
    }
    else {
      storageCheckChange(false);
      UserApiService.fetchUserByID(user_id)
        .then(res => {
          if (res.data.nickname) {
            // Redux State 세팅
            var nickname = res.data.nickname;
            var userinfo = { loginstate: true, userid: user_id, nickname: nickname };
            dispatch(setUserLoginCheck(userinfo));

            // Firebase Redux State 세팅
            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                dispatch(setUser(user));
              } else {
                // Firebase만 로그아웃 된 경우 처리 필요
                // dispatch(clearUser());
              }
            });
          }
          else {
            localStorage.removeItem('userid');
            dispatch(setUserLogout());
            history.push('/');
          }
        })
        .catch(err => {
          console.log('***** App.js fetchUserByID error:', err);
        });
        
        // 저장한 글 가져오기
        BoardApiService.fetchSavedUserBoardCheck(user_id)
        .then(res =>{
            var data = { savedBoards: res.data };
            dispatch(setSavedBoards(data));
        })
        .catch(err =>{
          console.log('***** Community fetchSavedUserBoardCheck error:', err);
        })
        
        // 좋아요 한 댓글리스트 가져오기 
        UserApiService.fetchUserLikedCommentList(user_id)
        .then(res => {
        var data = { likedComments: res.data };
        dispatch(setLikedComments(data));
        })
        .catch(err => {
        console.log('***** Community fetchUserLikedCommentList error:', err);
        }); 
        // 좋아요 한 게시물리스트 가져오기 
        UserApiService.fetchUserLikedBoardList(user_id)
        .then(res => {
        var data = { likedBaords: res.data };
        dispatch(setLikedBoards(data));
        })
        .catch(err => {
        console.log('***** Community fetchUserLikedBoardList error:', err);
        }); 
        // 신고한 데이터리스트 가져오기 
        DeclareApiService.fetchDeclaredByID(user_id)
        .then(res => {
          console.log(res.data)
          let tempcommentlist = [];
          let tempboardlist = [];
          for(var i =0;i<res.data.length;i++){
            tempcommentlist.push(res.data[i]['comment_id'])
            tempboardlist.push(res.data[i]['board_id'])
          }
          console.log(tempcommentlist)
          console.log(tempboardlist)
          
        var data = { declarecomment: tempcommentlist,
                  declareboard : tempboardlist};
        
        dispatch(setDeclareData(data));
        })
        .catch(err => {
        console.log('***** Community fetchDeclaredByID error:', err);
        });
    }
  };

  return (
    <div className="App">
      <Switch>

        <Layout>
          <Header />

          <Route exact path="/">
            {
              storageCheck
              ?
              <HeroSection />
              :
              ""
            }

            <SearchPanel />
            <MainPanels component={MainPanels} />
            <Introducing />
          </Route>

          <Route exact path="/Login" component={Login} />
          <Route exact path="/Register" component={Register} />
          <Route exact path="/Indicators" component={Indicators} />
          <Route exact path="/Backtest" component={Backtest} />
          <Route exact path="/Backtest2" component={Backtest2} />
          <Route exact path="/Backtest3" component={Backtest3} />
          <Route exact path="/Community" component={Community} />
          <Route exact path="/Community/:boardid" component={Community} />
          <Route exact path="/Community/update/:updateboardid" component={Community} />
          <Route exact path="/Community/search/:searchkeyword" component={Community} />
          <Route exact path="/IndicatorDetailExeFor/:symbol" component={IndicatorDetailExeFor} />
          <Route exact path="/IndicatorDetail" component={IndicatorDetail} />
          <Route exact path="/IndicatorDetail1/:tableName" component={IndicatorDetail1} />
          <Route exact path="/IndicatorDetail2/:tableName" component={IndicatorDetail2} />
          <Route exact path="/CommentUsdkrw2/:tableName/:num" component={CommentUsdkrw2} />
          <Route exact path="/PaymentFirst" component={PaymentFirst} />
          <Route exact path="/Payment" component={Payment} />
          <Route exact path="/PaymentSub" component={PaymentSub} />
          <Route exact path="/ChatPage" component={ChatPage} />
          <Route exact path="/SearchResult/:search" component={SearchResult} />
          <Route exact path="/News" component={News} />
          <Route exact path="/NewsDetail/:newsId" component={NewsDetail} />
          <Route exact path="/Stocks/:stockId" component={Stocks} />
          <Route exact path="/Profile" component={Profile} />
          <Route exact path="/Logout" component={Logout} />
          <Route exact path="/Test" component={BlockTest} />

          <Footer />
        </Layout>
      </Switch>
    </div>
  );
}

export default App;