import React, {useState, useEffect, useRef } from "react"
import { Text, Div, Button, Container, Icon,Modal } from "atomize";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ChartKor from "../chart/ChartKor"
import CommentUsdkrw from "./CommentUsdkrw"
import CorrKor from "../chart/CorrKor"
import IndApi from "../../../../../api/IndApi";
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import axios from "axios";

function IndicatorDetail() {

    let [result, resultbyun] = useState("");
    let [hits, hitsbyun] = useState([]); 

    let [inds, indsbyun] = useState([]); 

    let [nums, numsbyun] = useState('')
    let [date, datesbyun] = useState('')
    let [chart1, chartShow1 ] = useState(true);
    let [chart2, chartShow2 ] = useState(false);
    let [chart3, chartShow3 ] = useState(false);

   
    function moveHref(url){

     window.open(url)
    }

    function searchmatchparse(){
      axios.get("http://localhost:8000/news/searchmatchparse", { params :{id : "달러", id: "원화"}})
      .then(response =>{
        result=response.data
        
        var hits2 = result['hits']['hits']
              
        if(hits2.length > 9)
        {
          hitsbyun([result['hits']['hits'][0], result['hits']['hits'][1], result['hits']['hits'][2], result['hits']['hits'][3], result['hits']['hits'][4], result['hits']['hits'][5], result['hits']['hits'][6], result['hits']['hits'][7], result['hits']['hits'][8]])
        }
        hitsbyun(hits2)
      })
      .catch(error=>{
        console.log(error);
      });
    }

    function corrAbs(){
      IndApi.corrAbs("usdkrw", 5)
      .then(res=>{
        console.log("상관관계 확인", res.data)
        indsbyun(res.data)
      })
    }


    useEffect(() => {
     window.scrollTo(0, 0)
      IndApi.chartIndi(1)
      .then(res =>{
        numsbyun(res.data[0]["price"])
        datesbyun(res.data[0]["dates"].substring(0,10))
        
      }
      )
      .catch(err => {
        console.error('1일 수치 확인 오류(국내환율)', err);
      
        })
        searchmatchparse()
        corrAbs()
      
     }, []);

     
    
    return (     
      
      <div align = "center">
        <Container d="flex" flexDir="column" m={{ x: { xs: '0', md: '0' }, y: { xs: '4rem', md: '4rem' }}} >
       
        <Text
                textAlign="left"
                textSize="title"
                m={{ t: "0.5rem", b: "0.5rem" }}
                textWeight="800"
                fontFamily="ko"
                >
                
                원/달러
              </Text>
          
          <Div  d="flex" flexDir="row ">
          <Text
               textAlign="left"
                textSize="title"
                m={{ t: "0", b: "1rem" }}
                textWeight="800"
                fontFamily="ko"
                textColor="info700"
              >
                {nums}
          </Text>  
          <Text
              textAlign="left"
               textSize="caption"
              m={{ t: "0.5rem", b: "0.5rem" }}
              textWeight="800"
              fontFamily="ko"
              textColor="white"
        
          >
          ((
          </Text> 
          <Text
              textAlign="left"
               textSize="caption"
              m={{ t: "0.5rem", b: "0.5rem" }}
              textWeight="800"
              fontFamily="ko"
              textColor="light"
        
          >
          ({date} 기준)
          </Text> 
          </Div>

          <Container d="flex" flexDir="row ">
        <Button onClick={() => {chartShow1(true); chartShow2(false); chartShow3(false);} } 
            
            bg="info700"
            hoverBg="info800"
            rounded="circle"
            h={{ xs: '2rem', md: '2rem' }}
            w={{ xs: '5rem', md: '5rem' }}
            m='0.5rem'
            shadow="3"
            hoverShadow="4"
          >
            1개월
          </Button>
          <Button onClick={() => {chartShow2(true); chartShow1(false); chartShow3(false);} } 
            
            bg="info700"
            hoverBg="info800"
            rounded="circle"
            h={{ xs: '2rem', md: '2rem' }}
            w={{ xs: '5rem', md: '5rem' }}
            m='0.5rem'
            shadow="3"
            hoverShadow="4"
          >
            3개월 
          </Button>
          <Button onClick={() => {chartShow3(true); chartShow1(false); chartShow2(false);} }
            
            bg="info700"
            hoverBg="info800"
            rounded="circle"
            h={{ xs: '2rem', md: '2rem' }}
            w={{ xs: '5rem', md: '5rem' }}
            m='0.5rem'
            shadow="3"
            hoverShadow="4"
          >
            6개월
          </Button>
        
          </Container>
          
          {
            chart1 === true
            ? <ChartKor nums={30}/>
            : null
          }
          {
            chart1 === true
            ? <CorrKor nums={30}/>
            : null
          }

          {
            chart2 === true
            ? <ChartKor nums={90}/>
            : null
          }
          {
            chart2 === true
            ? <CorrKor nums={90}/>
            : null
          }
          {
            chart3 === true
            ? <ChartKor nums={180}/>
            : null
          }
           {
            chart3 === true
            ? <CorrKor nums={180}/>
            : null
          }
          
           <Text
            textAlign="left"
            textSize="title"
            m={{ t: "0rem", b: "0rem" }}
            textWeight="800"
            fontFamily="ko"
         >
          관련지표
        </Text>
        
        <Container d="flex" flexDir="row">
        <Icon name="Checked" size="20px"  m={{ t: "0.5rem", b: "1rem" }}/>
        <Text
            fontColor="dark"
            textAlign="left"
            textSize="subheader"
            m={{ t: "0.5rem", b: "1rem" }}
            textWeight="600"
            fontFamily="ko"
         >
          전체 기간에서 상관관계가 높은 5개의 지표와 상관계수입니다.
        </Text>
        </Container>
        <Container  m={{ t: "-1rem", b: "0" }}>
        <Table >
        
          <TableHead>
          <TableRow>
          {inds.map(ind => 
                <TableCell align="center">
                 {
                  (ind.indiname == '달러인덱스') || (ind.indiname == '비트코인') || (ind.indiname == '미 10년 채권수익률') || (ind.indiname == '미 2년 채권수익률')
                  ?
                  (
                    <Link to={`/IndicatorDetail1/${ind.indicator}`} ><button>{ind.indiname}</button></Link>
                  ) : (
                    (ind.indiname == '국제 금') || (ind.indiname == 'WTI') 
                    ?
                    (
                      <Link to={`/IndicatorDetail2/${ind.indicator}`} ><button>{ind.indiname}</button></Link>
                    ) : (
                      (ind.indiname == '달러/유로') || (ind.indiname == '영국 파운드/달러') || (ind.indiname == '일본 엔/달러') || (ind.indiname == '중국 위안/달러')
                      ?
                      (
                        <Link to={`/IndicatorDetailExeFor/${ind.indicator}`} ><button>{ind.indiname}</button></Link>
                      ) :
                      ''
                    )
                  )
                 
                }
                  </TableCell>                   
                )}     
           </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
              {inds.map(ind => 
              <TableCell align="center">{ind.usdkrw}</TableCell>                   
              )
          }  
              </TableRow> 
           
              </TableBody>
        </Table>
        </Container>
          <Text
            textAlign="left"
            textSize="title"
            m={{ t: "2rem", b: "0rem" }}
            textWeight="800"
            fontFamily="ko"
          >
                뉴스 목록
              </Text> 
          
          </Container>
          {hits.map(function(data){
        return(
          
        <Div  m = {{ xs: "1.5rem", md: "-1.5rem" }}>
        
        <Div
        bg="white" 
        d="inline-block" align="center"
        >
       <Div
        h = {{ xs: "3rem", md: "6rem" }}
        w = {{ xs: "25rem", md: "70rem" }}
      
        border={{ b: "1px solid" }}
        borderColor="gray400"
        pos = "flex"
        d={{ xs: "inline-block", md: "inline-block", lg: "inline-block" }}
       >

           <Div
           align="flex-start"
           h = {{xs : "rem" ,md : "auto"}}
           m = {{ xs: "-1rem", md: "-1.5rem" }}
           onClick = {() => {moveHref(data['_source']['news_url'])}}
           >
            <Text
                textAlign="left"
                textSize="subheader"
                m = {{ xs: "-1rem", md: "0" }}
                textWeight="800"
                fontFamily="ko"
              >
               {data['_source']['news_title']}
               </Text>
               <Text
                m = {{ xs: "1rem", md: "0" }}
                textAlign="left"  
                textColor="gray900"
               >{data['_source']['news_group']} | {data['_source']['news_source']} | {data['_source']['news_date'].substring(0,10)} | </Text>  
            
           </Div>
       </Div>
    </Div>

    </Div>
    
)})}
    <CommentUsdkrw/>
      </div> 
    )
}


export default IndicatorDetail;