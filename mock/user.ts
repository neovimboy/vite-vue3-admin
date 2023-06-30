import type { MockMethod } from 'vite-plugin-mock'

const users: any[] = [
    {
        name: 'admin',
        password: '123456',
        token: 'admin',
        info: {
            name: '系统管理员',
        },
    },
    {
        name: 'editor',
        password: '123456',
        token: 'editor',
        info: {
            name: '编辑人员',
        },
    },
    {
        name: 'test',
        password: '123456',
        token: 'test',
        info: {
            name: '测试人员',
        },
    },
]
export default [
    {
        url: '/mock/user/login',
        method: 'post',
        response: ({ body }: any) => {
            const user = users.find((user) => {
                return body.name === user.name && body.password === user.password
            })
            if (user) {
                return {
                    code: 200,
                    data: {
                        token: user.token,
                    },
                    message: 'success',
                }
            }
            else {
                return {
                    code: 401,
                    data: {},
                    message: '用户名或密码错误',
                }
            }
        },
    },
    {
        url: '/mock/user/info',
        method: 'post',
        response: ({ body }: any) => {
            const { token } = body
            const info = users.find((user) => {
                return user.token === token
            }).info
            if (info) {
                return {
                    code: 200,
                    data: {
                        info,
                    },
                    message: 'success',
                }
            }
            else {
                return {
                    code: 403,
                    data: {},
                    message: '无访问权限',
                }
            }
        },
    },
    {
        url: '/mock/user/out',
        method: 'post',
        response: () => {
            return {
                code: 200,
                data: {},
                message: 'success',
            }
        },
    },
    {
        url: '/mock/user/passwordChange',
        method: 'post',
        response: () => {
            return {
                code: 200,
                data: {},
                message: 'success',
            }
        },
    },
] as MockMethod[]
