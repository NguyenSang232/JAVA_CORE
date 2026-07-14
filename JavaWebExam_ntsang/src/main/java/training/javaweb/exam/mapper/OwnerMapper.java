package training.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import training.javaweb.exam.dto.response.OwnerDTO;
import training.javaweb.exam.entity.Owner;

@Mapper
public interface OwnerMapper {

	void insert(Owner owner);

	List<OwnerDTO> findAll();

	OwnerDTO findDetail(Long id);

	OwnerDTO findDTOById(Long id);

	void update(Owner owner);

	List<OwnerDTO> search(String keyword);

	void softDelete(Long id);

}