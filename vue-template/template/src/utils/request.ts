// 仿useFetch
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { toValue, type MaybeRefOrGetter, type Fn } from '@vueuse/core'
import { ref, shallowRef, toRef, watch } from 'vue'

axios.defaults.withCredentials = true
axios.defaults.baseURL = ''

export interface BeforeFetchContext {
  url: string
  options: Omit<AxiosRequestConfig, 'url'>
  cancel: Fn
}

interface useRequestOption {
  immediate?: boolean
  refetch?: boolean
  beforeRequest?: (ctx: BeforeFetchContext) => Promise<any>
}

export function useRequest(url: MaybeRefOrGetter<string>): any
export function useRequest(
  url: MaybeRefOrGetter<string>,
  axiosOptions: Omit<AxiosRequestConfig, 'url'>
): any
export function useRequest(
  url: MaybeRefOrGetter<string>,
  axiosOptions: Omit<AxiosRequestConfig, 'url'>,
  useRequestOption: useRequestOption
): any
export function useRequest(url: MaybeRefOrGetter<string>, ...args: any[]) {
  const token = localStorage.getItem('token') || ''
  // 创建一个 CancelToken.source
  const cancelSource = axios.CancelToken.source()
  let options: useRequestOption = { immediate: true, refetch: false }
  let requestOptions: any = {
    method: 'GET'
  }
  const defaultOptions = {
    headers: {
      token
    }
  }
  if (args.length > 0) {
    requestOptions = { ...requestOptions, ...args[0] }
  }

  if (args.length === 2) {
    options = { ...options, ...args[1] }
  }

  const error = shallowRef<any>(null)
  const data = shallowRef<any>(null)
  const statusCode = ref<number | null>(null)
  const response = shallowRef<AxiosResponse | null>(null)
  const loading = ref(false)
  const isFinished = ref(false)

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
    isFinished.value = !isLoading
  }

  const execute = async () => {
    // 1. 取消 about
    cancelSource.cancel()
    // 2. set loading
    setLoading(true)

    error.value = null
    statusCode.value = null

    let isCanceled = false

    const context = {
      url: toValue(url),
      options: requestOptions,
      cancel: () => {
        isCanceled = true
      }
    }

    if (options.beforeRequest) {
      Object.assign(context, await options.beforeRequest(context))
    }

    if (isCanceled) {
      setLoading(false)
      return Promise.resolve(null)
    }

    return new Promise((resolve) => {
      axios({
        url: context.url,
        ...context.options,
        headers: {
          ...defaultOptions.headers,
          ...context.options?.headers
        },
        cancelToken: cancelSource.token
      })
        .then((res: AxiosResponse) => {
          response.value = res
          if (res.status === 200) {
            statusCode.value = res.data.code
            // 请求成功
            if (res.data.code === 0) {
              // 预期结果
              data.value = res.data.data
            } else if (res.data.code === 401) {
              // 去登录页面
            }
          } else {
            error.value = res.data.msg
          }
        })
        .catch((err) => {
          error.value = err
          return resolve(null)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const refetch = toRef(options.refetch)

  watch([refetch, toRef(url)], ([refetch]) => refetch && execute(), { deep: true })

  if (options.immediate) {
    Promise.resolve().then(() => execute())
  }

  return {
    error,
    data,
    statusCode,
    response,
    loading,
    isFinished
  }
}

// axios返回结果全局处理
axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // 对响应错误做点什么
    console.log('error', error.message)
    // throw error
    return Promise.reject(error.message || '接口请求异常')
  }
)

// 如果useFetch使用习惯的话，建议使用useFetch
// 下面为实现代码
// 具体用法可以参考我的文章： https://juejin.cn/post/7238911457847623736 【也可以阅读源码。实现并不复杂】
// import { createFetch } from '@vueuse/core'

// const base = 'https://api.yeshaojun.com/v1/'
// const useMyFetch = createFetch({
//   baseUrl: base,
//   options: {
//     beforeFetch(ctx: any) {
//       ctx.options.headers.token = (localStorage.getItem('token') as string) || ''
//       return ctx
//     },
//     onFetchError(ctx) {
//       console.log('ctx', ctx)
//       if (JSON.parse(ctx.data).errorCode === 10006) {
//         window.location.href = '/login'
//         localStorage.clear()
//         return ctx
//       }
//       const msg = JSON.parse(ctx.data).msg
//       if (typeof msg === 'string') {
//       } else {
//       }
//       return Promise.reject(msg)
//     }
//   },
//   fetchOptions: {
//     mode: 'cors'
//   }
// })

// export { useMyFetch }
