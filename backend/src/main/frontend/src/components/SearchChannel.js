import "./SearchChannel.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getChannelInfo, getChannelList } from "../api/channel";
import {
  getParticipantListByUser,
  registerParticipant,
} from "../api/participant";
import { SET_CHANNELLIST } from "../redux/ChannelList";
import Pagination from "./Pagination";
import styled from "styled-components";

function SearchChannel() {
  const token = useSelector((state) => state.UserInfo.accessToken);
  const [searchName, setSearchName] = useState("");
  const [channellistview, setChannellist] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const dispatch = useDispatch();

  console.log(searchName, channellistview, limit, page, offset);

  useEffect(() => {
    console.log("useeffect start channellistview", channellistview);
    getChannelList(
      searchName,
      "",
      token,
      (response) => {
        console.log(response.data);
        setChannellist(response.data.channelList);
        console.log("useeffect channellistview", channellistview);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);
  const onSubmitSearchForm = () => {
    console.log(token);
    console.log("searchName ", searchName);
    getChannelList(
      searchName,
      "",
      token,
      (response) => {
        console.log(response.data.channelList);
        setChannellist(response.data.channelList);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  const onRegisterChannel = (channel) => {
    console.log(channel);
    console.log(token);
    registerParticipant(
      channel,
      token,
      (response) => {
        let list = [];
        getParticipantListByUser(
          token,
          (response) => {
            dispatch(SET_CHANNELLIST(list));
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
        console.log("채널 추가  ", response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  const onChangeSearchName = (e) => {
    setSearchName(e.target.value);
  };
  return (
    <Layout>
      <div className="article-search">
        <input
          type="text"
          value={searchName}
          onChange={onChangeSearchName}
        ></input>
        <button type="text" onClick={onSubmitSearchForm}>
          검색
        </button>
      </div>

      <label>
        페이지 당 표시할 게시물 수:&nbsp;
        <select
          type="number"
          value={limit}
          onChange={({ target: { value } }) => setLimit(Number(value))}
        >
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>

      <div className="main">
        {channellistview.slice(offset, offset + limit).map((channel) => (
          <div className="card">
            <div className="card-header">
              <div className="card-header-is_closed">
                <div className="card-header-text"> 모집중 </div>
                <div className="card-header-number"> 2 / 5 </div>
              </div>
            </div>

            <div className="card-body">
              <div className="card-body-header">
                <h1>채널 제목 : {channel.channelName}</h1>
                <p className="card-body-hashtag">
                  채널 태그 : {channel.channelTag}
                </p>
                <p className="card-body-nickname">
                  채널장: {channel.userSeq} (일단은 userSeq)
                </p>
              </div>
              <p className="card-body-description">
                채널 설명 :{channel.channelDesc}
              </p>
              <button
                onClick=
                {() => {
                  onRegisterChannel(channel);
                }}
                >{channel.channelName} 채널 들어가기
              </button>
            </div>
          </div>
        ))}
      </div>
      <footer>
        <Pagination
          total={channellistview.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </footer>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
`;
export default SearchChannel;