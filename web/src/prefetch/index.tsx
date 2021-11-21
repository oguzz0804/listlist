/**
 * Fetch before rendering
 */
import { getAllCategories, getGeoInfo, tokenValidation } from "../data-request";
import { userAuthLSInfos, getGeoLocation } from "../utils";

// Execute prefetchs before rendering
const preFetchExecute = (reduxUseDispatch: (parms:any) => void) => {
  /**
   * Init the categories
   */
  getAllCategories((result:any) => {
    reduxUseDispatch({
      type: "saveCategories",
      value: result.data.category,
    });
  });

  /**
   * Init the user's geo infos
   */
  /*getGeoInfo((result:any) => {
    if(!result.data || !result.data.geo){
      reduxUseDispatch({
        type: "updateUserGeo",
        value:{
          country: "CA",
          region: "MB",
          city: "Winnipeg",
          ll: ['49.8179', '-97.1535'],
          remarks: "Error, use default values.",
        },
      });
    }

    reduxUseDispatch({
      type: "updateUserGeo",
      value:{
        country: result.data.geo.country,
        region: result.data.geo.region,
        city: result.data.geo.city,
        ll: result.data.geo.ll,
        remarks: "No error.",
      },
    });
  });*/
  getGeoLocation((res: {
    lat: number,
    long: number,
    remark: string,
  }) => {
    getGeoInfo(res.lat, res.long, (result:any) => {
      if(!result.data || !result.data.geo){
        reduxUseDispatch({
          type: "updateUserGeo",
          value:{
            country: "CA",
            region: "MB",
            city: "Winnipeg",
            street: "Carlton St",
            zipcode: "R3C 0V4",
            remarks: "Error, use default values.",
          },
        });
      }
  
      reduxUseDispatch({
        type: "updateUserGeo",
        value:{
          country: result.data.geo.country,
          region: result.data.geo.region,
          city: result.data.geo.city,
          street: result.data.geo.street,
          zipcode: result.data.geo.zipcode,
          remarks: "No error.",
        },
      });
    });
  });

  /**
   * Validate the token
   */
  tokenValidation(reduxUseDispatch);
};

export {
  preFetchExecute,
};
