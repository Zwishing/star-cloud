import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/user/api';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import type { RequestConfig } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development';
// 登录页面路径
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * 获取初始状态
 */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // 定义一个函数，用于获取当前用户信息
  const fetchUserInfo = async () => {
    try {
      // 请求当前用户信息
      const msg = await queryCurrentUser({
        skipErrorHandler: true, // 跳过错误处理程序
      });
      return msg.data;
    } catch (error) {
      // 如果出错，跳转到登录页面
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果当前页面不是登录页面，获取用户信息
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// 配置ProLayout，API文档：https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // 渲染顶部操作栏
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    // 配置头像属性
    avatarProps: {
      src: initialState?.currentUser?.avatar, // 头像图片
      title: <AvatarName />, // 头像名称
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>; // 渲染头像下拉菜单
      },
    },
    // 配置水印内容
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // 渲染页脚
    footerRender: () => <Footer />,
    // 页面改变时的处理函数
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，且当前页面不是登录页面，跳转到登录页面
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // 配置背景图片列表
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    // 如果是开发环境，配置链接
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined, // 自定义菜单头部渲染
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // 如果处于加载状态，可以返回一个加载组件
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                // 设置新的配置，并更新初始状态
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...errorConfig, // 错误处理配置
};
