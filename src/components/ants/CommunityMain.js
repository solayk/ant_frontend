import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Div, Image, Container, Button, Anchor, scrollTo, Icon, Text,Radiobox, Label,Switch,Row,Col,logoSketch,logoReact } from "atomize"
import logo from "../../images/logo.svg"
import producthunt from "../../images/logo-producthunt.svg"
import { Link, Route, useHistory, useParams } from 'react-router-dom';
import BoardApiService from "../../api/BoardApi";
import { AddAlarmSharp } from "@material-ui/icons"

function CommunityMain(props) {
  let [showMobileHeaderMenu, showMobileHeaderMenuChange] = useState(false);
  let [selectedSwitchValue,selectedSwitchValueChange] = useState(false);
  let [liked,likedchange] = useState(false);

  let { die } = useParams();

  let [boardlist ,boardlist변경] = useState([{board_content : ""}]); 
  // selectedSwitchValueChange(props.orderswitch);
  function toggleHeaderMenu(value) {
    showMobileHeaderMenuChange(value);
    setTimeout(() => {
      window.scrollTo(0, window.scrollY + 1)
    }, 400);
  };
  useEffect(() => {
    // if(die === "die"){
    //   BoardApiService.fetchBoardsSave()
    // .then(res => {
    //   boardlist변경(res.data);
    //   console.log(res.data[0].userid);
    //   // console.log('asdasdadadads');
    // })
    // .catch(err => {
    //   console.log('***** Community fetchBoards error:', err);
    // }); 

    // }

    BoardApiService.fetchBoards()
    .then(res => {
      boardlist변경(res.data);
      console.log(res.data[0].userid);
      // console.log('asdasdadadads');
    })
    .catch(err => {
      console.log('***** Community fetchBoards error:', err);
    }); 
    
  },[]);

    return (
<>
<Div pos = "relative" 
         m={{t :{ md : "5%"}, l :{ md : "-80%"}}}
         w = {{xs: "100%", md : "250%"}}>
             
            <Row>
           {
            boardlist.map(function(data){
              var nowtime = new Date()
              var boardtime = new Date(data['board_createdata'])
              var elapsedtime = nowtime.getTime() - boardtime.getTime()
              let elapsedMin = elapsedtime / 1000 / 60; // 150.0666...
              let elapsedHour = elapsedtime / 1000 / 60 / 60; // 2.501111...
              let elapsedDay = elapsedtime / 1000 / 60 / 60 / 24;
              var resulttime;
              if(elapsedMin < 10){
                resulttime = "now"
              }else if (elapsedMin >= 10 && elapsedMin < 60 ){
                resulttime = String(Math.floor(elapsedMin))+"분" 
              }else if (elapsedMin >= 60 && elapsedHour < 24){
                resulttime = String(Math.floor(elapsedHour))+"시간" 
              }else if (elapsedHour >= 24 && elapsedHour < 48){
                resulttime = "어제"
              }else if (elapsedHour >= 48 && elapsedDay < 30){
                resulttime = String(Math.floor(elapsedDay))+"일" 
              }else if (elapsedDay >= 30){
                resulttime = String(boardtime.getMonth()+1)+"."+String(boardtime.getDate())
              }
              
              return(
                        <Col size={{ xs: 12, md: 6, lg: 6 }} pos="relative">
                        <Div
                          shadow="4"
                          border="1px solid"
                          borderColor="gray200"
                          rounded="lg"
                          p="2rem"
                          m={{ b: { xs: "2rem", md: "1rem" } }}
                        >
                        <Div p="1rem" d="flex" align="center" justify="space-between">
                          <Div d="inline-block" align="center" >
                            <Div d="flex">
                              <Link to={"/Community/"+data['board_id']}  style={{ color: '#000' }}>
                                <Text
                                textAlign="left"
                                textSize="title"
                                textWeight="700"
                                fontFamily="secondary"
                                m={{ b: "1rem" }}
                                >
                                {data['board_title']}
                                </Text>
                              </Link>
                              <Icon name="Bookmark" size="20px" />
                            </Div>
                              <Link to={"/Community/"+data['board_id']}  style={{ color: '#000' }}>
                              <Text
                              textAlign="left"
                              textSize="body"
                              textWeight="500"
                              fontFamily="secondary"
                              m={{ b: "1rem" }}
                              >
                            {data['board_content'].length > 77 ? data['board_content'].substring(0,70)+"..." :data['board_content'] }
                              </Text>
                              </Link>
                          </Div>

                        </Div>

                        <Div p="1rem" d="flex" align="center" justify="space-between">
                            <Div d="inline-block" align="center">
                        <Text
                            textAlign="left"
                            textSize="body"
                            textWeight="700"
                            fontFamily="secondary"
                            m={{ b: "0.2rem" }}
                            >
                            {data['nickname']}
                        </Text>
                        <Div d="flex" align="center">
                            <Icon
                                transition
                                name= "Eye"
                                color= "black"
                                size="18px"
                                // cursor="pointer"
                                m={{r : "0.4rem"}}
                            />
                            <Text
                            textAlign="left"
                            textSize="body"
                            textWeight="450"
                            fontFamily="secondary"
                            m={{r : "1rem"}}
                            >
                            {data['board_viewnum']}
                            </Text>
                            <Icon
                                transition
                                // onClick={() => likedchange(!liked)}
                                // name={liked ? "HeartSolid" : "Heart"}
                                name= "HeartSolid"
                                // color={liked ? "danger700" : "black"}
                                color= "danger700"
                                size="18px"
                                // cursor="pointer"
                                m={{r : "0.4rem"}}
                            />
                            <Text
                            textAlign="left"
                            textSize="body"
                            textWeight="450"
                            fontFamily="secondary"
                            m={{r : "1rem"}}
                            >
                              {data['board_LikeNum']}
                            </Text>
                            <Icon
                                transition
                                name= "Message"
                                color= "black"
                                size="18px"
                                // cursor="pointer"
                                m={{r : "0.4rem"}}
                            />
                            <Text
                            textAlign="left"
                            textSize="body"
                            textWeight="450"
                            fontFamily="secondary"
                            m={{r : "1rem"}}
                            >
                            121
                            </Text>
                              </Div>
                          </Div>
                        <Div d="flex" align="center">
                          <Div
                            h="1.5rem"
                            w="1.5rem"
                          //   bgImg={girl2}
                            bgSize="cover"
                            bgPos="center"
                            m={{ r: "1rem" }}
                            rounded="circle"
                          ></Div>
                          <Text textWeight="500">
                            {resulttime}
                          </Text>
                        </Div>
                      </Div>
                            {/* 끝 */}
                        </Div>
                      </Col>
              )
            })
            }
            </Row>
          </Div>
        
    </>
  )
}

export default CommunityMain;