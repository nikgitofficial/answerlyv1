import React, { useState, useContext, useEffect } from "react"; 
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Collapse,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";
import logo from "../assets/logo.png"; // ✅ your logo

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sets, setSets] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenu, setProfileMenu] = useState(null);

  const handleToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err.message);
    }
    logout();
    navigate("/login");
  };

  const fetchSets = async () => {
    if (!user) return;
    try {
      const res = await axios.get("/question-sets");
      setSets(res.data);
    } catch (err) {
      console.error("Error fetching question sets:", err);
    }
  };

  useEffect(() => {
    fetchSets();
  }, [user]);

  useEffect(() => {
    const handleUpdate = () => fetchSets();
    window.addEventListener("questionSetsUpdated", handleUpdate);
    return () =>
      window.removeEventListener("questionSetsUpdated", handleUpdate);
  }, [user]);

  const menuItems = !user
    ? [
        { text: "Home", path: "/publichome" },
        { text: "About", path: "/about" },
        { text: "Register", path: "/register" },
      ]
    : [
        { text: "Home", path: "/home" },
        { text: "Create Question", path: "/create-question" },
        {
          text: "Answers",
          children: sets.map((set) => ({
            text: set.title,
            path: `/all-answers/${set.slug}`,
          })),
        },
      ];

  const navButtonStyles = {
    color: "#FFFFFF",
    fontWeight: 600,
    position: "relative",
    textTransform: "none",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "0%",
      height: "2px",
      bottom: 8,
      left: 0,
      bgcolor: "#FFD700",
      transition: "width 0.3s ease",
    },
    "&:hover::after": {
      width: "100%",
    },
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#2e7d32",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          borderRadius: "0 0 30px 30px",
          margin: "0 10px",
          width: "calc(100% - 20px)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo + App Name */}
          <Box
            component={Link}
            to={user ? "/home" : "/login"}
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 40, width: 40, mr: 1 }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#FFFFFF",
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              Answerly
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {menuItems.map((item, index) =>
              item.children ? (
                <div
                  key={index}
                  onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                  onMouseLeave={() => setAnchorEl(null)}
                >
                  <Button sx={navButtonStyles} disableRipple>
                    {item.text}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                      onMouseEnter: () => setAnchorEl(anchorEl),
                      onMouseLeave: () => setAnchorEl(null),
                    }}
                  >
                    {item.children.map((child, idx) => (
                      <MenuItem
                        key={idx}
                        component={Link}
                        to={child.path}
                        onClick={() => setAnchorEl(null)}
                      >
                        {child.text}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              ) : (
                <Button key={index} component={Link} to={item.path} sx={navButtonStyles}>
                  {item.text}
                </Button>
              )
            )}

            {/* ✅ Avatar/Profile dropdown with Welcome */}
            {user && (
              <>
                <Typography
                  variant="body1"
                  sx={{ color: "#FFD700", fontWeight: 600, mr: 1 }}
                >
                  Welcome : {user.username}
                </Typography>
                <IconButton onClick={(e) => setProfileMenu(e.currentTarget)}>
                  <Avatar
                    src={user.profilePic || ""}
                    alt={user.username}
                    sx={{ width: 40, height: 40 }}
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={profileMenu}
                  open={Boolean(profileMenu)}
                  onClose={() => setProfileMenu(null)}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {user.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      setProfileMenu(null);
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      setProfileMenu(null);
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>

          {/* Mobile Menu Toggle */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { md: "none" } }}
            onClick={handleToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Mobile Collapse Menu */}
        <Collapse in={mobileOpen} timeout="auto" unmountOnExit>
          <Box sx={{ bgcolor: "#2e7d32", p: 2 }}>
            <Stack spacing={1}>
              {menuItems.map((item, index) =>
                item.children ? (
                  <Box key={index}>
                    <Typography
                      sx={{ color: "#FFD700", fontWeight: 700, mb: 1 }}
                    >
                      {item.text}
                    </Typography>
                    {item.children.map((child, idx) => (
                      <Button
                        key={idx}
                        fullWidth
                        component={Link}
                        to={child.path}
                        onClick={handleToggle}
                        sx={{
                          ...navButtonStyles,
                          justifyContent: "flex-start",
                        }}
                      >
                        {child.text}
                      </Button>
                    ))}
                  </Box>
                ) : (
                  <Button
                    key={index}
                    fullWidth
                    component={Link}
                    to={item.path}
                    onClick={handleToggle}
                    sx={{ ...navButtonStyles, justifyContent: "flex-start" }}
                  >
                    {item.text}
                  </Button>
                )
              )}
              {user && (
                <>
                  <Typography
                    variant="body2"
                    sx={{ color: "#FFD700", fontWeight: 600, mt: 1 }}
                  >
                    Welcome, {user.username}
                  </Typography>
                  <Button
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      handleToggle();
                    }}
                    sx={{ ...navButtonStyles, justifyContent: "flex-start" }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Collapse>
      </AppBar>
    </>
  );
};

export default Navbar;
