/*global kakao */
import { createSlice } from "@reduxjs/toolkit";

export const pinListSlice = createSlice({
  name: "pinList",
  initialState: {
    currentMap: -1,
    centerLat: 37.5013068,
    centerLng: 127.0396597,
    pinList: [],
    dndLatLng: {},
  },
  reducers: {
    SET_PINLIST: (state, action) => {
      console.log(action.payload);
      if (state.currentMap === action.payload.mapSeq)
        state.pinList = action.payload.pinList;
      if (state.pinList.length > 0) {
        let bounds = new kakao.maps.LatLngBounds();
        state.pinList.map((pin) => {
          bounds.extend(new kakao.maps.LatLng(pin.pinLat, pin.pinLng));
        });
        state.centerLat =
          (bounds.getSouthWest().getLat() + bounds.getNorthEast().getLat()) / 2;
        state.centerLng =
          (bounds.getSouthWest().getLng() + bounds.getNorthEast().getLng()) / 2;
      } else {
        state.centerLat =
          state.centerLat === 37.5013068 ? 37.5013068001 : 37.5013068;
        state.centerLng =
          state.centerLat === 127.0396597 ? 127.0396597001 : 127.0396597;
      }
      console.log("state.pinList : ", state.pinList);
    },
    ADD_PIN: (state, action) => {
      if (state.currentMap === action.payload.mapSeq)
        state.pinList = [...state.pinList, action.payload];
    },
    SET_PIN: (state, action) => {
      if (state.currentMap === action.payload.mapSeq) {
        state.pinList.map((pin) => {
          if (pin.pinSeq == action.payload.pinSeq) {
            if (action.payload.type == "title") {
              pin.pinTitle = action.payload.pinTitle;
            } else if (action.payload.type == "content") {
              pin.pinContent = action.payload.pinContent;
            }
          }
        });
      }
    },
    CLICK_PIN: (state, action) => {
      state.pinList.map((pin) => {
        if (pin.pinSeq === action.payload.pinSeq) {
          pin.isVisible = !pin.isVisible;
        }
      });
    },
    DELETE_PIN: (state, action) => {
      let delIndex;
      if (state.currentMap === action.payload.mapSeq) {
        state.pinList.map((pin, idx) => {
          if (pin.pinFlag === action.payload.pinFlag) {
            if (pin.pinOrder === action.payload.sourceOrder) {
              delIndex = idx;
            } else if (pin.pinOrder > action.payload.sourceOrder) {
              pin.pinOrder -= 1;
            }
          }
        });
      }
      state.pinList.splice(delIndex, 1);
    },
    SET_PINORDER_DIFFLAG: (state, action) => {
      if (state.currentMap === action.payload.mapSeq) {
        state.pinList.map((pin) => {
          if (pin.pinFlag === action.payload.pinFlag) {
            if (pin.pinOrder > action.payload.sourceOrder) {
              pin.pinOrder -= 1;
            } else if (pin.pinOrder === action.payload.sourceOrder) {
              pin.pinFlag = pin.pinFlag ^ 1;
              pin.pinOrder = action.payload.destinationOrder;
            }
          } else {
            if (pin.pinOrder >= action.payload.destinationOrder) {
              pin.pinOrder += 1;
            }
          }
        });
      }
    },
    SET_PINORDER_SAMEFLAG: (state, action) => {
      if (state.currentMap === action.payload.mapSeq) {
        state.pinList.map((pin) => {
          if (pin.pinFlag === action.payload.pinFlag) {
            if (action.payload.sourceOrder < action.payload.destinationOrder) {
              // ?????? order??? ?????? order?????? ?????????
              if (
                pin.pinOrder > action.payload.sourceOrder &&
                pin.pinOrder <= action.payload.destinationOrder
              ) {
                pin.pinOrder -= 1;
              } else if (pin.pinOrder === action.payload.sourceOrder) {
                pin.pinOrder = action.payload.destinationOrder;
              }
            } else {
              // ?????? order??? ?????? order?????? ?????????
              if (
                pin.pinOrder >= action.payload.destinationOrder &&
                pin.pinOrder < action.payload.sourceOrder
              ) {
                pin.pinOrder += 1;
              } else if (pin.pinOrder === action.payload.sourceOrder) {
                pin.pinOrder = action.payload.destinationOrder;
              }
            }
          }
        });
      }
    },
    SET_CURRENTMAP: (state, action) => {
      state.currentMap = action.payload;
    },
    SET_DNDLATLNG: (state, action) => {
      state.dndLatLng = action.payload;
    },
  },
});

export const {
  SET_PINLIST,
  ADD_PIN,
  SET_PIN,
  CLICK_PIN,
  DELETE_PIN,
  SET_PINORDER_DIFFLAG,
  SET_PINORDER_SAMEFLAG,
  SET_CURRENTMAP,
  SET_DNDLATLNG,
} = pinListSlice.actions;
// export const pinsSelector = (state) => state.pinList;

export default pinListSlice.reducer;
