import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SockJs from "sockjs-client";
import StompJs from "stompjs";
import { getParticipantListByUser } from "../../api/participant";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_PIN,
  SET_PIN,
  SET_PINORDER_DIFFLAG,
  SET_PINORDER_SAMEFLAG,
} from "../../redux/PinList";
import { SET_STOMP } from "../../redux/ChannelList";
import { SET_CHANNELLIST, SET_CHANNELSEQ } from "../../redux/ChannelList";
import { getChannelInfo } from "../../api/channel";
import { getMapList } from "../../api/map";
import { SET_MAPLIST } from "../../redux/MapList";
import { getPinList } from "../../api/pin";
/// setStomp 이거 수정해야함!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export default function ChannelTest() {
  const dispatch = useDispatch();
  // const [channelList, setChannelList] = useState([]);
  const token = useSelector((state) => state.UserInfo.accessToken);
  const pins = useSelector((state) => state.PinList.pinList);
  const channelList = useSelector((state) => state.ChannelList.channelList);

  useEffect(() => {
    let list = [];
    getParticipantListByUser(
      token,
      (response) => {
        response.data.list.map((participant) => {
          console.log(participant);
          getChannelInfo(
            participant.participantsId.channelSeq,
            token,
            ({ data }) => {
              let channel = {
                channelSeq: participant.participantsId.channelSeq,
                channelDesc: data.channelDesc,
                channelName: data.channelName,
                channelTag: data.channelTag,
              };
              list = list.concat(channel);
              dispatch(SET_CHANNELLIST(list));
              // setChannelList(list);
            },
            (error) => {
              console.log("error", error);
            }
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  function enterChannel(id) {
    console.log(id);
    const sock = new SockJs("http://localhost:8080/ws");
    const stomp = StompJs.over(sock);

    getMapList(
      id,
      "channel",
      token,
      (response) => {
        dispatch(SET_MAPLIST(response.data.mapsList));
      },
      (error) => {
        console.log(error);
      }
    );

    stomp.connect({}, (e) => {
      stomp.subscribe("/user/" + id + "/private", (data) => {
        const message = JSON.parse(data.body);
        switch (message.status) {
          case "ADDPIN":
            const newPin = {
              pinSeq: Number(message.pinSeq),
              pinLat: message.lat,
              pinLng: message.lng,
              pinColor: message.pinColor,
              pinTitle: message.pinTitle,
              pinOrder: Number(message.pinOrder),
              pinFlag: 0,
              mapSeq: Number(message.mapSeq),
              userSeq: Number(message.userSeq),
              isVisible: false,
            };
            dispatch(ADD_PIN(newPin));
            break;
          case "MODPIN":
            dispatch(
              SET_PIN({
                pinSeq: message.pinSeq,
                pinColor: message.pinColor,
                pinContent: message.pinContent,
              })
            );
            break;
          case "MOD_PINLIST_DIFFLAG":
            dispatch(
              SET_PINORDER_DIFFLAG({
                mapSeq: Number(message.mapSeq),
                pinFlag: Number(message.pinFlag),
                sourceOrder: Number(message.sourceOrder),
                destinationOrder: Number(message.destinationOrder),
              })
            );
            console.log(pins);
            break;
          case "MOD_PINLIST_SAMEFLAG":
            dispatch(
              SET_PINORDER_SAMEFLAG({
                mapSeq: Number(message.mapSeq),
                pinFlag: Number(message.pinFlag),
                sourceOrder: Number(message.sourceOrder),
                destinationOrder: Number(message.destinationOrder),
              })
            );
            console.log(pins);
            break;
          default:
        }
      });
    });
  }

  return (
    <>
      <ul className="header_items">
        {channelList.map((channel) => (
          <li
            key={channel.channelSeq}
            className="header_items_2 headerSetting2"
          >
            <Link
              to={`/serverpage/${channel.channelSeq}`}
              onClick={() => {
                dispatch(SET_CHANNELSEQ(channel.channelSeq));
                enterChannel(channel.channelSeq);
              }}
            >
              {channel.channelName}
              <span class="tooltiptext">{channel.channelName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
