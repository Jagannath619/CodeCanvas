export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  region: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface EC2Instance {
  instanceId: string;
  name: string;
  state: string;
  type: string;
  publicIp?: string;
  privateIp?: string;
  launchTime?: string;
  az: string;
}

export interface S3Bucket {
  name: string;
  creationDate?: string;
  region?: string;
}

export interface S3Object {
  key: string;
  size: number;
  lastModified?: string;
  storageClass?: string;
}

export interface VPCInfo {
  vpcId: string;
  cidrBlock: string;
  state: string;
  isDefault: boolean;
  name: string;
}

export interface SubnetInfo {
  subnetId: string;
  vpcId: string;
  cidrBlock: string;
  az: string;
  availableIps: number;
  name: string;
}

export interface RouteTableInfo {
  routeTableId: string;
  vpcId: string;
  routes: { destination: string; target: string; state: string }[];
  name: string;
}

export interface SecurityGroupInfo {
  groupId: string;
  groupName: string;
  description: string;
  vpcId: string;
  inboundRules: number;
  outboundRules: number;
}

export interface RDSInstance {
  dbInstanceId: string;
  engine: string;
  engineVersion: string;
  status: string;
  endpoint?: string;
  port?: number;
  instanceClass: string;
  multiAZ: boolean;
  storageType: string;
  allocatedStorage: number;
}

export interface IAMUser {
  userName: string;
  userId: string;
  arn: string;
  createDate?: string;
  passwordLastUsed?: string;
}

export interface IAMRole {
  roleName: string;
  roleId: string;
  arn: string;
  createDate?: string;
  description?: string;
}

export interface CloudWatchAlarm {
  alarmName: string;
  state: string;
  metric: string;
  namespace: string;
  threshold?: number;
  comparisonOperator?: string;
}

export interface CommandHistoryEntry {
  id: string;
  action: string;
  category: string;
  region: string;
  timestamp: string;
  status: 'success' | 'error';
  resultSummary: string;
}

export type AWSRegion = {
  code: string;
  name: string;
};

export const AWS_REGIONS: AWSRegion[] = [
  { code: 'us-east-1', name: 'US East (N. Virginia)' },
  { code: 'us-east-2', name: 'US East (Ohio)' },
  { code: 'us-west-1', name: 'US West (N. California)' },
  { code: 'us-west-2', name: 'US West (Oregon)' },
  { code: 'eu-west-1', name: 'EU (Ireland)' },
  { code: 'eu-west-2', name: 'EU (London)' },
  { code: 'eu-central-1', name: 'EU (Frankfurt)' },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  { code: 'sa-east-1', name: 'South America (São Paulo)' },
  { code: 'ca-central-1', name: 'Canada (Central)' },
];