import React,{useState} from 'react';
import "./Sidebar.scss";
// import { GiHumanPyramid } from "react-icons/gi";
import { HiMenuAlt3 } from "react-icons/hi";
import sideBarMenu from '../../data/sidebar';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import { RiProductHuntLine } from 'react-icons/ri';

const Sidebar = ({children}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const navigate = useNavigate();
  const goHome = () => navigate("/");

  return (
    <div className='layout'>
      <div className='sidebar' style={{width: isOpen ? "230px" : "60px"}}>
        
        <div className='top_section'>
          <div className='logo' style={{display: isOpen ? "block" : "none"}}>
            {/* <GiHumanPyramid size = {30} style = {{cursor: "pointer"}} onClick = {goHome}/>   */}
            <RiProductHuntLine size = {30} style = {{cursor: "pointer"}} onClick = {goHome}/>
          </div>
          <div className='bars' style={{marginLeft: isOpen ? "130px" : "0px",
                                        marginTop: isOpen ? "-7px" : "-5px"}}>
          <HiMenuAlt3 onClick={toggle} style = {{cursor: "pointer"}}/>
          </div>
        </div>

        {sideBarMenu.map((item,index) => {
          return <SidebarItem key={index} item={item} isOpen={isOpen}/>
        })}
      </div>

      <main 
        style={{
          paddingLeft: isOpen ? '230px' : '60px', 
          transition: 'all .5s',
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default Sidebar;