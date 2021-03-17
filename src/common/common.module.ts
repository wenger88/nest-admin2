import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: `F803A1FD4F1B3CC8EE3E05E33605045CB850DC97A68E2560A8440084A05A5E7F`,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtModule],
})
export class CommonModule {}
