import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http'
import {contentHeaders} from '../../common/headers';
import * as _ from 'lodash';
import { config } from '../../common/config';
import {STATIC_VALUE} from "../config/staticValue";

// const _ = require('lodash');
const template = require('./mainPage.html');

@Component({
  selector: 'mainPage',
  template: template,
})

export class MainPage {
  jwt: string;
  public data;
  pageSize: number;
  pageStartIndex: number;
  serverHost: string;
  returnedDatas = [];

  constructor(public router: Router, public http: Http) {

    this.pageSize = 8;
    this.pageStartIndex=0;
    let URL = [config.serverHost, config.path.buildCase + "?pageSize=" + this.pageSize + '&pageStartIndex=' + this.pageStartIndex].join('/');

    this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
      .map(res => res.json())//받아온 값을 json형식으로 변경
      .subscribe(
        response => {
          this.serverHost = config.serverHost;

          //for of문으로 for~of 루프구문은 배열의 요소들, data 순회하기 위한구문
          for (var buildCaseData of response.buildCaseInfo) {
            let bulidPlaceArr = JSON.parse(buildCaseData.buildPlace);
            let key = _.findKey(STATIC_VALUE.PLACE_TYPE, ["number", buildCaseData.buildType]);

            this.returnedDatas.push({
              idx: buildCaseData.idx,
              title: buildCaseData.title,
              mainPreviewImage: buildCaseData.mainPreviewImage,
              buildTotalArea: buildCaseData.buildTotalArea,
              buildType: STATIC_VALUE.PLACE_TYPE[key].name,
              buildTotalPrice: buildCaseData.buildTotalPrice,
              buildPlace: bulidPlaceArr[1],
              buildPlaceDetail: bulidPlaceArr[2]
            });
          }
        },
        error => {
          alert(error.text());
          console.log(error.text());
          //서버로 부터 응답 실패시 경고창
        }
      )
  }

  transform(numOfSet:number) {
    return _.chunk(this.returnedDatas, numOfSet);
  }
}
