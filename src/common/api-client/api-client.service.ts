import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

import { ApiClientOptions } from './api-client.interface';

@Injectable()
export class ApiClientService {
  private readonly client: AxiosInstance;

  constructor(
    @Inject('API_CLIENT_OPTIONS') private readonly options: ApiClientOptions,
  ) {
    this.client = axios.create({
      baseURL: options.baseUrl,
      timeout: options.timeout ?? 5000,
    });

    this.client.interceptors.request.use((config) => config);

    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.get(url, config);
    return res.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.client.post(url, data, config);
    return res.data;
  }
}
