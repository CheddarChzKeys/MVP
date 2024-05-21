import React, {useEffect} from "react";

const UserHome = ({changeClicked}) => {

useEffect(()=>{
  changeClicked("userHome")
},[]);

return(
    <div id="userHomeWrapper">
      <div>User Homepage</div>
    </div>
)

}

export default UserHome;