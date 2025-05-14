import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../../services/api';

// Material UI组件
import { 
  Box, 
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Button,
  TextField,
  Paper,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  ListItem,
  Container
} from '@mui/material';

// Material UI图标
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  MoreHoriz as MoreHorizIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  RepeatOutlined as RepeatOutlinedIcon,
  Send as SendIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';

import './Home.css';

// 抽屉宽度
const drawerWidth = 240;

// 模拟推文数据
const DUMMY_POSTS = [
  {
    id: 1,
    author: {
      username: 'ElonMusk',
      displayName: 'Elon Musk',
      avatar: 'https://via.placeholder.com/40'
    },
    content: 'Just another day building rockets and electric cars! #SpaceX #Tesla',
    timestamp: '5 minutes ago',
    likes: 1200,
    comments: 432,
    reposts: 200
  },
  {
    id: 2,
    author: {
      username: 'BillGates',
      displayName: 'Bill Gates',
      avatar: 'https://via.placeholder.com/40'
    },
    content: 'Climate change remains our greatest challenge. We need to invest in clean energy now.',
    timestamp: '20 minutes ago',
    likes: 950,
    comments: 231,
    reposts: 187
  },
  {
    id: 3,
    author: {
      username: 'JeffBezos',
      displayName: 'Jeff Bezos',
      avatar: 'https://via.placeholder.com/40'
    },
    content: 'The key to success is to focus on customer experience and constantly innovate on their behalf.',
    timestamp: '1 hour ago',
    likes: 743,
    comments: 129,
    reposts: 98
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  
  // 处理抽屉开关
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  useEffect(() => {
    // 检查用户是否已登录
    const fetchUserData = async () => {
      // 首先检查是否已登录
      if (!authAPI.isLoggedIn()) {
        // 如果没有登录，重定向到登录页面
        navigate('/login');
        return;
      }
      try {
        // 尝试从API获取最新的用户信息（优先API）
        const freshUserData = await userAPI.getCurrentUser();
        if (freshUserData && freshUserData.user) {
          setUser(freshUserData.user);
          localStorage.setItem('user', JSON.stringify(freshUserData.user));
        } else {
          // 如果API没有返回user字段，尝试本地
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setUser(userData);
          } else {
            throw new Error('User data not found');
          }
        }
      } catch (err) {
        console.error('Home页面错误:', err);
        setError('Unable to load user data, please login again');
        setTimeout(() => {
          authAPI.logout();
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);
  
  const handleLogout = () => {
    // 使用API服务处理登出
    authAPI.logout();
  };
  
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      alert(`发布了新内容: ${newPostContent}`);
      setNewPostContent('');
      // 实际项目中，这里会调用API发送新帖子
    }
  };
  
  // 侧边栏内容
  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 应用标志 */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Echo
        </Typography>
      </Box>
      <Divider />
      
      {/* 导航菜单 */}
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <Button 
            variant="text" 
            fullWidth 
            sx={{ 
              borderRadius: 28, 
              textTransform: 'none',
              justifyContent: 'flex-start',
              px: 3,
              py: 1.5
            }}
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
        </ListItem>
        
        <Box sx={{ p: 1 }}>
          <Button 
            variant="text" 
            fullWidth 
            sx={{ 
              borderRadius: 28, 
              textTransform: 'none',
              justifyContent: 'flex-start',
              px: 3,
              py: 1.5
            }}
            onClick={() => alert('Notifications')}
            startIcon={<NotificationsIcon />}
          >
            Notifications
          </Button>
        </Box>
        
        <Box sx={{ p: 1 }}>
          <Button 
            variant="text" 
            fullWidth 
            sx={{ 
              borderRadius: 28, 
              textTransform: 'none',
              justifyContent: 'flex-start',
              px: 3,
              py: 1.5
            }}
            onClick={() => alert('Bookmarks')}
            startIcon={<BookmarkIcon />}
          >
            Bookmarks
          </Button>
        </Box>
        
        <ListItem disablePadding>
          <Button 
            variant="text" 
            fullWidth 
            sx={{ 
              borderRadius: 28, 
              textTransform: 'none',
              justifyContent: 'flex-start',
              px: 3,
              py: 1.5
            }}
            onClick={() => navigate('/profile')}
            startIcon={<PersonIcon />}
          >
            Profile
          </Button>
        </ListItem>
        
        <Box sx={{ p: 1 }}>
          <Button 
            variant="text" 
            fullWidth 
            sx={{ 
              borderRadius: 28, 
              textTransform: 'none',
              justifyContent: 'flex-start',
              px: 3,
              py: 1.5
            }}
            onClick={() => alert('More options')}
            startIcon={<MoreHorizIcon />}
          >
            More
          </Button>
        </Box>
      </List>
      
      {/* 用户信息和登出按钮 */}
      {user && (
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button 
            variant="outlined" 
            color="secondary"
            fullWidth 
            sx={{ 
              borderRadius: 28, 
              textTransform: 'none',
              justifyContent: 'flex-start',
              py: 1,
              borderColor: '#f44336',
              color: '#f44336',
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(244, 67, 54, 0.04)'
              }
            }}
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
          >
            Logout
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 2,
            p: 1,
            borderRadius: 2,
            '&:hover': { 
              backgroundColor: 'rgba(0, 0, 0, 0.04)' 
            },
            cursor: 'pointer'
          }}>
            <Avatar 
              src={user.avatar} 
              alt={user.nickname || user.username}
              sx={{ width: 40, height: 40 }}
              onError={e => { e.target.src = "/default-avatar.png"; }}
            >
              {(user.nickname || user.username)?.charAt(0)}
            </Avatar>
            <Box sx={{ ml: 1, overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
                {user.nickname || user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                @{user.username}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
  
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          p: 3
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Return to Login
        </Button>
      </Box>
    );
  }
  
  if (!user) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          p: 3
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          User data not available
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Return to Login
        </Button>
      </Box>
    );
  }
  
  // 显示昵称，如果没有昵称则回退到用户名
  const displayName = user.nickname || user.username;
  
  // Vite 环境变量兼容
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
  const avatarUrl = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}${user.avatar}`)
    : "/default-avatar.png";
  
  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* 移动端顶部应用栏 */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: 'none' }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Echo
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* 侧边导航栏 */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* 移动端抽屉 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // 为了移动端性能
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* 桌面端侧边栏 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      
      {/* 主要内容区域 */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          bgcolor: '#f5f8fa',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar sx={{ display: { sm: 'none' } }} /> {/* 为移动端顶部应用栏留空间 */}
        
        <Container disableGutters maxWidth="md" sx={{ bgcolor: 'white', height: '100%' }}>
          <Grid container sx={{ width: '100%', m: 0 }}>
            {/* 主时间线 */}
            <Grid item xs={12} md={8} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
              {/* 顶部标题栏 */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(5px)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Home
                </Typography>
              </Box>
              
              {/* 发布新帖区域 */}
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar 
                    src={avatarUrl}
                    alt={displayName}
                    sx={{ mr: 1.5, width: 48, height: 48 }}
                    onError={e => { e.target.src = "/default-avatar.png"; }}
                  >
                    {displayName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      variant="standard"
                      placeholder="What's happening?"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained"
                        disabled={!newPostContent.trim()}
                        onClick={handlePostSubmit}
                        sx={{ 
                          borderRadius: 28,
                          textTransform: 'none',
                          px: 3
                        }}
                      >
                        Echo
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {/* 帖子列表 */}
              {DUMMY_POSTS.map(post => (
                <Paper 
                  key={post.id} 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    '&:hover': { 
                      bgcolor: 'rgba(0, 0, 0, 0.01)' 
                    },
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Avatar 
                      src={post.author.avatar} 
                      alt={post.author.displayName}
                      sx={{ mr: 1.5 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {post.author.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          @{post.author.username} · {post.timestamp}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mt: 0.5, mb: 1 }}>
                        {post.content}
                      </Typography>
                      
                      {/* 帖子操作按钮 */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 400 }}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <ChatBubbleOutlineIcon fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {post.comments}
                          </Typography>
                        </IconButton>
                        
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <RepeatOutlinedIcon fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {post.reposts}
                          </Typography>
                        </IconButton>
                        
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <FavoriteBorderIcon fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {post.likes}
                          </Typography>
                        </IconButton>
                        
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Grid>
            
            {/* 右侧栏 - 只在桌面端显示 */}
            <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' }, p: 2, position: 'sticky', top: 0, height: 'fit-content' }}>
              {/* 用户个人信息卡片 */}
              <Card sx={{ mb: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar 
                      src={avatarUrl} 
                      alt={displayName}
                      sx={{ width: 56, height: 56 }}
                      onError={e => { e.target.src = "/default-avatar.png"; }}
                    >
                      {displayName.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6">
                      {displayName}
                    </Typography>
                  }
                  subheader={`@${user.username}`}
                />
                {user.bio && (
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {user.bio}
                    </Typography>
                  </CardContent>
                )}
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/profile')}
                    sx={{ textTransform: 'none' }}
                  >
                    View Profile
                  </Button>
                </CardActions>
              </Card>
              
              {/* "Who to follow" 推荐 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Who to follow
                  </Typography>
                  
                  {['Alice Smith', 'Bob Johnson', 'Carol Williams'].map((name, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: index !== 2 ? 2 : 0,
                      borderBottom: index !== 2 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none'
                    }}>
                      <Avatar sx={{ mr: 1.5 }}>
                        {name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">
                          {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{name.toLowerCase().replace(' ', '')}
                        </Typography>
                      </Box>
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ 
                          borderRadius: 28,
                          textTransform: 'none'
                        }}
                      >
                        Follow
                      </Button>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 