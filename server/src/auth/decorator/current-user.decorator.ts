import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // user 객체(JwtPayload) 가져오기
    const user = request.user;

    // 인자가 주어지면 해당 속성만, 아니면 객체 전체를 반환
    return data ? user?.[data] : user;
  }
);
